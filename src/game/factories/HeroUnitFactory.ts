import { AssetManager, ImageAsset, getElementByClassName } from "../../library";
import { Vector2D } from "../../library/math";
import { Circle } from "../../library/math/Circle";
import { Rect } from "../../library/math/Rect";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Agent, AgentImageName, AgentImageSet } from "../models/Agent";

export class HeroUnitFactory {

    constructor(
        protected game: Game,
    ) {
    }

    public makeSwordsman(
        position: Vector2D,
    ) {
        const size = 48;
        const shape = new Circle(position, size / 2);
        const entity = new Agent(
            this.game,
            shape,
            this.getImageSet('swordsman'),
            true,
        );
        entity.max_hitpoints = entity.hitpoints = 40;
        entity.movement_speed = 100;
        return entity;
    }

    public getImageSet(type: keyof typeof image_sets): AgentImageSet {
        const images = image_sets[type]
            .map(
                ([key, image_name]): [AgentImageName, ImageAsset] => [key, this.game.assets.getImage(image_name)]
            );
        return new Map<AgentImageName, ImageAsset>(images);
    }
}

const image_sets = {
    swordsman: [
        [AgentImageName.DEFAULT, Assets.images.area.player],
    ],
} as const;