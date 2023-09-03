import { AssetManager, ImageAsset, getElementByClassName } from "../../library";
import { Vector2D } from "../../library/math";
import { Circle } from "../../library/math/Circle";
import { Rect } from "../../library/math/Rect";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Agent, AgentImageName, AgentImageSet } from "../models/Agent";
import { Effect, EffectImageName } from "../models/Effect";
import { Obstacle, ObstacleImageName } from "../models/Obstacle";

export class ObstacleFactory {

    constructor(
        protected game: Game,
    ) {
    }

    public makeTree(
        position: Vector2D,
    ) {
        const rect = Rect.fromCenterAndSize(position.cpy(), { x: 32, y: 64 });
        const entity = new Obstacle(
            this.game,
            rect,
            this.getImageSet('tree'),
        );
        return entity;
    }

    public getImageSet(type: keyof typeof image_sets): Map<ObstacleImageName, ImageAsset> {
        const images = image_sets[type]
            .map(
                ([key, image_name]): [ObstacleImageName, ImageAsset] => [key, this.game.assets.getImage(image_name)]
            );
        return new Map<ObstacleImageName, ImageAsset>(images);
    }
}

const image_sets = {
    tree: [
        [ObstacleImageName.DEFAULT, Assets.images.area.obstacle],
    ],
} as const;