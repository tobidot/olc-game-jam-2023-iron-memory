import { ImageAsset } from "../../library";
import { Rect } from "../../library/math/Rect";
import { Game } from "../base/Game";
import { Entity } from "./Entity";

export enum EffectImageName {
    DEFAULT,
}

export type EffectImageSet = Map<EffectImageName, ImageAsset>;

export class Effect extends Entity {
    public is_destroyed: boolean = false;
    public alpha: number = 1;
    public update_callback?: ((effect: Effect, delta_seconds:number)=>void);

    public constructor(
        public readonly game: Game,
        public rect: Rect,
        public rotation: number,
        public images: EffectImageSet,
        public seconds_to_live: number = 0.5,
    ) {
        super();
    }

    public update(delta_seconds: number): void {
        this.seconds_to_live -= delta_seconds;
        // this.alpha = this.seconds_to_live / 0.5;
        if (this.update_callback) {
            this.update_callback(this, delta_seconds);
        }
        if (this.seconds_to_live <= 0) {
            this.is_destroyed = true;
        }
    }
}