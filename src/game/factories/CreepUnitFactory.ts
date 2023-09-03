import { AssetManager, ImageAsset, getElementByClassName } from "../../library";
import { Vector2D } from "../../library/math";
import { Circle } from "../../library/math/Circle";
import { Rect } from "../../library/math/Rect";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Agent, AgentImageName, AgentImageSet } from "../models/Agent";

export class CreepUnitFactory {

    constructor(
        protected game: Game,
    ) {
    }

    public makeGoblin(
        position: Vector2D,
    ) {
        const size = 16;
        const shape = new Circle(position, size / 2);
        const entity = new Agent(
            this.game,
            shape,
            this.getImageSet('goblin'),
            false,
        );
        entity.max_hitpoints = entity.hitpoints = 6;
        entity.movement_speed = 140;
        entity.hitpoints = 6;
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
    goblin: [
        [AgentImageName.DEFAULT, Assets.images.area.enemy],
    ],
} as const;