import { AssetManager, ImageAsset, getElementByClassName } from "../../library";
import { Vector2D } from "../../library/math";
import { Circle } from "../../library/math/Circle";
import { Rect } from "../../library/math/Rect";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Agent, AgentImageName, AgentImageSet } from "../models/Agent";
import { Effect, EffectImageName } from "../models/Effect";

export class EffectFactory {

    constructor(
        protected game: Game,
    ) {
    }

    public makeSlash(
        position: Vector2D,
        width: number,
        range: number,
        direction: Vector2D,
    ) {
        const rect = Rect.fromCenterAndSize(position.cpy().add(direction.cpy().mul(range/2)), { x: width, y: range });
        const ttl = 0.2;
        const entity = new Effect(
            this.game,
            rect,
            direction.angle(),
            this.getImageSet('slash'),
            ttl
        );
        entity.update_callback =()=>{
            entity.alpha = entity.seconds_to_live / ttl;
        }
        return entity;
    }

    public getImageSet(type: keyof typeof image_sets): Map<EffectImageName, ImageAsset> {
        const images = image_sets[type]
            .map(
                ([key, image_name]): [EffectImageName, ImageAsset] => [key, this.game.assets.getImage(image_name)]
            );
        return new Map<EffectImageName, ImageAsset>(images);
    }
}

const image_sets = {
    slash: [
        [EffectImageName.DEFAULT, Assets.images.area.slash],
    ],
} as const;