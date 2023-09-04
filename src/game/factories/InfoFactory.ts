import { AssetManager, ImageAsset, getElementByClassName } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Agent, AgentImageName, AgentImageSet } from "../models/Agent";
import { Info } from "../models/Info";

export class InfoFactory {

    constructor(
        protected game: Game,
    ) {
    }

    public makeInfo(
        position: Vector2D,
        text: Array<string>,
        image?: ImageAsset,
    ) : Info{
        const size = 64;
        const shape = Rect.fromCenterAndSize(position, new Vector2D(size , size));
        if (!image) {
            image = this.game.assets.getImage(Assets.images.info.hit_me);
        }
        const entity = new Info(
            this.game,
            shape,
            this.getImageSet(image),
            text,
            'white',
        );
        entity.is_neutral = true;
        entity.physics.fixed = true;
        entity.max_hitpoints = entity.hitpoints = 50;
        entity.movement_speed = 0;
        entity.physical_resistance = 4;
        return entity;
    }

    public getImageSet(image: ImageAsset): AgentImageSet {
        const images = [AgentImageName.DEFAULT]
            .map(
                (key): [AgentImageName, ImageAsset] => [key, image]
            );
        return new Map<AgentImageName, ImageAsset>(images);
    }
}
