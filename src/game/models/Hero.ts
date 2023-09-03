import { AABBPhysicsProxy, ImageAsset, assert } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Shape } from "../../library/math/Shape";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { SatPhysicsProxy } from "../../library/physics/SatPhysicsEngine";
import { Game } from "../base/Game";
import { WorldMapAreaBorder } from "../consts/Direction";
import { Agent } from "./Agent";
import { Entity } from "./Entity";

export enum AgentImageName {
    DEFAULT,
}

export type AgentImageSet = Map<AgentImageName, ImageAsset>;

export class Hero extends Agent {

    public constructor(
        protected game: Game,
        shape: Shape,
        images: AgentImageSet,
        is_player: boolean,
    ) {
        super(game, shape, images, is_player);
    }

    public update(delta_seconds: number): void {
        super.update(delta_seconds);
    }

    public onWorldCollision(distance: Vector2D): void {
        // do nothing
        const border = ((): WorldMapAreaBorder => {
            if (distance.x > 0) {
                return WorldMapAreaBorder.EAST;
            } else if (distance.x < 0) {
                return WorldMapAreaBorder.WEST;
            } else if (distance.y > 0) {
                return WorldMapAreaBorder.SOUTH;
            } else {
                return WorldMapAreaBorder.NORTH;
            }
        })();
        this.game.controller.travel(border);
    }

    public onCollision(other: PhysicsProxy, collision: Collision): void {
        // do nothing
    }
}