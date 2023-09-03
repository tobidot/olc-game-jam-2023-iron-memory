import { AABBPhysicsProxy, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Shape } from "../../library/math/Shape";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { SatPhysicsProxy } from "../../library/physics/SatPhysicsEngine";
import { Game } from "../base/Game";
import { Agent, AgentImageSet } from "./Agent";
import { AttackDamage } from "./AttackDamage";
import { Entity } from "./Entity";
import { Physical } from "./Physical";

export class AiAgent extends Agent {

    public constructor(
        game: Game,
        shape: Shape,
        images: AgentImageSet,
        is_player: boolean,
    ) {
        super(game, shape, images, is_player);
    }

    public update(delta_seconds: number): void {
        super.update(delta_seconds);
        const player = this.game.model.walkable_area.hero;
        if (!player) {
            return;
        }
        if (this.channel !== null) {
            this.physics.velocity.set({ x: 0, y: 0 });
            return;
        }
        const target = player.physics.shape.getCenter();
        const distance = target.cpy().sub(this.physics.shape.getCenter()).length();
        const direction = target.cpy().sub(this.physics.shape.getCenter()).normalize();
        this.physics.velocity = direction.cpy().mul(this.movement_speed);
        const light_attack = this.getLightAttackStruct();
        const heavy_attack = this.getHeavyAttackStruct();
        const can_do_light_attack = distance < this.light_attack.attack_range;
        const can_do_heavy_attack = distance < this.heavy_attack.attack_range;
        if (can_do_light_attack || can_do_heavy_attack) {
            if (!can_do_heavy_attack) {
                this.game.controller.lightAttack(this, direction);
            } else if (!can_do_light_attack) {
                this.game.controller.heavyAttack(this, direction);
            } else {
                const choose_heavy = Math.random() < 0.3;
                if (choose_heavy) {
                    this.game.controller.heavyAttack(this, direction);
                } else {
                    this.game.controller.lightAttack(this, direction);
                }
            }
        }
    }

    public onWorldCollision(distance: Vector2D): void {
        // do nothing
    }

    public onCollision(other: PhysicsProxy, collision: Collision): void {
        // do nothing
    }

    public applyDamage(damage: AttackDamage) {
        const physical = Math.max(damage.physical - this.physical_resistance, 0);
        const psy = Math.max(damage.psy - this.psy_resistance, 0);
        const ice = Math.max(damage.ice - this.ice_resistance, 0);
        const fire = Math.max(damage.fire - this.fire_resistance, 0);
        const total = physical + psy + ice + fire;
        this.hitpoints -= total;

        // display damage for all damage types
        const types = [physical, psy, ice, fire];
        const colors = ["white", "hotpink", "aqua", "orange"];
        types.forEach((damage, index) => {
            if (damage > 0) {
                const position = this.physics.shape.getCenter().cpy().add(new Vector2D(index * 10, -20));
                const effect = this.game.model.effect_factory.makeDamageText(
                    position,
                    damage.toFixed(0),
                    colors[index],
                );
                this.game.model.walkable_area.addEntity(effect);
            }
        });

        if (this.hitpoints <= 0) {
            this.is_dead = true;
        }
    }
}