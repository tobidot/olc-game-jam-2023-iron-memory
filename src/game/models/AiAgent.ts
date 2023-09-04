import { Vector2D } from "../../library/math";
import { Shape } from "../../library/math/Shape";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { Game } from "../base/Game";
import { Agent, AgentImageSet } from "./Agent";

export type AiAgentAttackPattern = Array<"heavy" | "light" | "s1" | "s2" | "s3">;

export class AiAgent extends Agent {
    public attack_pattern: AiAgentAttackPattern ;
    public attack_pattern_index: number = 0;
    public seconds_since_last_attack: number = 0;
    public seconds_between_auto_attacks: number = 3;

    public constructor(
        game: Game,
        shape: Shape,
        images: AgentImageSet,
        attack_pattern: AiAgentAttackPattern = ["light", "light", "heavy"]
    ) {
        super(game, shape, images, false);
        this.attack_pattern = attack_pattern;
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
        const next_attack_name = this.attack_pattern[this.attack_pattern_index];
        const next_attack = { 
            light: this.getLightAttackStruct(),
            heavy: this.getHeavyAttackStruct(),
            s1: this.special_attack_1,
            s2: this.special_attack_2,
            s3: this.special_attack_3,
        }[next_attack_name];
        const can_attack = next_attack.attack_range === 0 || distance < next_attack.attack_range;
        const auto_attack = this.seconds_since_last_attack > this.seconds_between_auto_attacks;
        if (can_attack || auto_attack) {
            this.game.controller.attack(this, direction, next_attack);
            this.attack_pattern_index = (this.attack_pattern_index + 1) % this.attack_pattern.length;
            this.seconds_since_last_attack = 0;
        }
    }

    public onWorldCollision(distance: Vector2D): void {
        // do nothing
    }

    public onCollision(other: PhysicsProxy, collision: Collision): void {
        // do nothing
    }

}