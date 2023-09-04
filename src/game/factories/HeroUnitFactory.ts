import { AssetManager, ImageAsset, getElementByClassName } from "../../library";
import { Vector2D } from "../../library/math";
import { Circle } from "../../library/math/Circle";
import { Rect } from "../../library/math/Rect";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Agent, AgentImageName, AgentImageSet } from "../models/Agent";
import { AttackAttributes } from "../models/AttackAttributes";
import { AttackDamage } from "../models/AttackDamage";
import { Hero } from "../models/Hero";

export class HeroUnitFactory {

    constructor(
        protected game: Game,
    ) {
    }

    public makeSwordsman(
        position: Vector2D,
    ) {
        const size = 32;
        const shape = new Circle(position, size / 2);
        const entity = new Hero(
            this.game,
            shape,
            this.getImageSet('swordsman'),
            true,
        );
        entity.max_hitpoints = entity.hitpoints = 40;
        entity.movement_speed = 200;
        
        entity.light_attack = new AttackAttributes(
            new AttackDamage(entity, 4, 0, 0, 0),
            40, 100, 0.5, 0
        );
        entity.heavy_attack =  new AttackAttributes(
            new AttackDamage(entity, 20, 0, 0, 0),
            60, 60, 0.5, 0.5
        );
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