import { AssetManager, ImageAsset, getElementByClassName } from "../../library";
import { Vector2D } from "../../library/math";
import { Circle } from "../../library/math/Circle";
import { Rect } from "../../library/math/Rect";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Agent, AgentImageName, AgentImageSet } from "../models/Agent";
import { AttackDamage } from "../models/AttackDamage";
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
        const rect = Rect.fromCenterAndSize(position.cpy().add(direction.cpy().mul(range / 2)), { x: width, y: range });
        const ttl = 0.2;
        const entity = new Effect(
            this.game,
            rect,
            direction.angle(),
            this.getImageSet('slash'),
            ttl
        );
        entity.update_callback = () => {
            entity.alpha = entity.seconds_to_live / ttl;
        }
        return entity;
    }

    public makeDamageText(position: Vector2D, text: string, color: string) {
        const ttl = 0.5;
        const entity = new Effect(
            this.game,
            Rect.fromCenterAndSize(position, { x: 0, y: 0 }),
            - Math.PI / 2,
            { text, color },
            ttl
        );
        entity.update_callback = (effect: Effect, delay_seconds: number) => {
            entity.alpha = entity.seconds_to_live / ttl;
            entity.rect.move({ x: 0, y: -50 * delay_seconds });
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