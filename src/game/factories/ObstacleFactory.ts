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

    public makeGras(position: Vector2D) {
        const rect = Rect.fromCenterAndSize(position.cpy(), { x: 92, y: 64 });
        const entity = new Obstacle(
            this.game,
            rect,
            this.getImageSet('gras'),
        );
        return entity;
    }

    public makeDungeon(position: Vector2D) {
        const rect = Rect.fromCenterAndSize(position.cpy(), { x: 96, y: 96 });
        const entity = new Obstacle(
            this.game,
            rect,
            this.getImageSet('dungeon'),
        );
        return entity;
    }

    public makeMountain(position: Vector2D) {
        const rect = Rect.fromCenterAndSize(position.cpy(), { x: 96, y: 128 });
        const entity = new Obstacle(
            this.game,
            rect,
            this.getImageSet('mountain'),
        );
        return entity;
    }

    public makeForrest(position: Vector2D) {
        const rect = Rect.fromCenterAndSize(position.cpy(), { x: 64, y: 128 });
        const entity = new Obstacle(
            this.game,
            rect,
            this.getImageSet('forrest'),
        );
        return entity;
    }

    public makeVillage(position: Vector2D) {
        const rect = Rect.fromCenterAndSize(position.cpy(), { x: 128, y: 128 });
        const entity = new Obstacle(
            this.game,
            rect,
            this.getImageSet('village'),
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
    dungeon: [
        [ObstacleImageName.DEFAULT, Assets.images.area.dungeon_obstacle],
    ],
    forrest: [
        [ObstacleImageName.DEFAULT, Assets.images.area.forrest_obstacle],
    ],
    mountain: [
        [ObstacleImageName.DEFAULT, Assets.images.area.mountain_obstacle],
    ],
    gras: [
        [ObstacleImageName.DEFAULT, Assets.images.area.gras_obstacle],
    ],
    village: [
        [ObstacleImageName.DEFAULT, Assets.images.area.village_obstacle],
    ],
} as const;