import { AssetManager, ImageAsset, getElementByClassName } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Agent, AgentImageName, AgentImageSet } from "../models/Agent";
import { Info } from "../models/Info";
import { Potion } from "../models/Potion";

export class PotionFactory {

    constructor(
        protected game: Game,
    ) {
    }

    public makePotion(
        position: Vector2D,
    ): Potion {
        const size = 20;
        const shape = Rect.fromCenterAndSize(position, new Vector2D(size, size));
        const entity = new Potion(
            this.game,
            shape,
            this.getImageSet('potion'),
        );
        return entity;
    }

    public getImageSet(type: keyof typeof image_sets): Map<AgentImageName, ImageAsset> {
        const images = image_sets[type]
            .map(
                ([key, image_name]): [AgentImageName, ImageAsset] => [key, this.game.assets.getImage(image_name)]
            );
        return new Map<AgentImageName, ImageAsset>(images);
    }
}

const image_sets = {
    potion: [
        [AgentImageName.DEFAULT, Assets.images.area.potion],
    ],
} as const;