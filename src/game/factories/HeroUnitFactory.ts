import { AssetManager, ImageAsset, getElementByClassName } from "../../library";
import { Vector2D } from "../../library/math";
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
        const rect = Rect.fromCenterAndSize(position, {x:size, y:size});
        const entity = new Agent(
            this.game,
            rect,
            this.getImageSet('swordsman'),
            true,
        );
        entity.hitpoints = 40;
        const speed = 30;
        entity.physics.velocity.set(Vector2D.fromAngle(Math.random() * Math.PI * 2, speed));
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