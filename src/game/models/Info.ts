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


export class Info extends Agent {
    public next_text_index: number = 0;
    public current_effect: null | Effect = null;

    public constructor(
        game: Game,
        shape: Shape,
        images: AgentImageSet,
        public text: Array<string> = [],
        public color: string = 'white',
    ) {
        super(
            game,
            shape,
            images,
            false,
        );
    }

    public onWorldCollision(distance: Vector2D): void {
        // do nothing
    }

    public onCollision(other: PhysicsProxy, collision: Collision): void {
        // do nothing
    }

    public applyDamage(damage: AttackDamage) {
        super.applyDamage(damage);
        this.nextText();
    }

    public nextText() {
        if (this.is_dead) {
            return;
        }
        if (this.next_text_index >= this.text.length) {
            this.next_text_index = 0;
            if (!!this.current_effect) {
                this.current_effect.is_destroyed = true;
                this.current_effect = null;
                return;
            }
        }
        const next_text = this.text[this.next_text_index];
        this.next_text_index = (this.next_text_index + 1);

        if (!this.current_effect || this.current_effect.is_destroyed) {
            const rect = this.physics.shape.getOuterBox();
            const position = new Vector2D(rect.center.x, rect.top - 20);
            const effect = this.current_effect = this.game.model.effect_factory.makeInfoText(
                position,
                next_text,
                this.color,
            );
            this.game.model.walkable_area.addEntity(effect);
        } else {
            this.current_effect.images = { text: next_text, color: this.color };
        }
    }

    public onDeath() {
        if (!!this.current_effect) {
            this.current_effect.is_destroyed = true;
            this.current_effect = null;
        }
    }

    public onKill(other: Agent) {

    }

}