import { AABBPhysicsProxy, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Shape } from "../../library/math/Shape";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { SatPhysicsProxy } from "../../library/physics/SatPhysicsEngine";
import { Game } from "../base/Game";
import { Agent, AgentImageSet } from "./Agent";
import { AttackAttributes } from "./AttackAttributes";
import { AttackDamage } from "./AttackDamage";
import { Effect } from "./Effect";
import { Entity } from "./Entity";
import { Physical } from "./Physical";


export class Potion extends Agent {

    public constructor(
        game: Game,
        shape: Shape,
        images: AgentImageSet,
    ) {
        super(
            game,
            shape,
            images,
            false,            
        );
        this.is_neutral = true;     
        this.hitpoints = this.max_hitpoints = 1;
        this.ice_resistance = 0;
        this.fire_resistance = 0;
        this.psy_resistance = 0;
        this.physical_resistance = 0;
    }

    public onWorldCollision(distance: Vector2D): void {
        // do nothing
    }

    public onCollision(other: PhysicsProxy, collision: Collision): void {
        // do nothing
    }

    public onDeath() {
        const hero = this.game.model.walkable_area.hero;
        if (!hero) {
            return;
        }
        hero.hitpoints = Math.min(hero.hitpoints + 10, hero.max_hitpoints);
        // add effect
        const effect = this.game.model.effect_factory.makeDamageText(
            this.physics.shape.getCenter(),
            '+10',
            'green',
        );
    }

    public onKill(other: Agent) {

    }

}