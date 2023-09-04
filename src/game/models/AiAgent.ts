import { Vector2D } from "../../library/math";
import { Shape } from "../../library/math/Shape";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { Game } from "../base/Game";
import { Agent, AgentImageSet } from "./Agent";

export class AiAgent extends Agent {
    public attack_pattern: Array<"heavy" | "light"> = ["light", "light", "heavy"];
    public attack_pattern_index: number = 0;
    public seconds_since_last_attack: number = 0;
    public seconds_between_auto_attacks: number = 3;

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
        if (!this.channel && this.cooldown <= 0) {
            this.seconds_since_last_attack += delta_seconds;
        }
        const target = player.physics.shape.getCenter();
        const distance = target.cpy().sub(this.physics.shape.getCenter()).length();
        const direction = target.cpy().sub(this.physics.shape.getCenter()).normalize();
        this.physics.velocity = direction.cpy().mul(this.movement_speed);
        const light_attack = this.getLightAttackStruct();
        const heavy_attack = this.getHeavyAttackStruct();
        const can_do_light_attack = distance < light_attack.attack_range;
        const can_do_heavy_attack = distance < heavy_attack.attack_range;
        const next_attack = this.attack_pattern[this.attack_pattern_index];
        // prevents it from doing nothing if stuck in a corner
        const auto_attack = this.seconds_since_last_attack > this.seconds_between_auto_attacks;
        if (next_attack === "light") {
            if (can_do_light_attack || auto_attack) {
                this.game.controller.lightAttack(this, direction);
                this.attack_pattern_index = (this.attack_pattern_index + 1) % this.attack_pattern.length;
                this.seconds_since_last_attack = 0;
            }
        } else if (next_attack === "heavy") {
            if (can_do_heavy_attack|| auto_attack) {
                this.game.controller.heavyAttack(this, direction);
                this.attack_pattern_index = (this.attack_pattern_index + 1) % this.attack_pattern.length;
                this.seconds_since_last_attack = 0;
            }
        }
    }

    public onWorldCollision(distance: Vector2D): void {
        // do nothing
    }

    public onCollision(other: PhysicsProxy, collision: Collision): void {
        // do nothing
    }

}