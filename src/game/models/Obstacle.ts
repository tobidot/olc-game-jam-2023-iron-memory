import { ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { PhysicsProxy, Collision } from "../../library/physics/Physics";
import { SatPhysicsProxy } from "../../library/physics/SatPhysicsEngine";
import { Game } from "../base/Game";
import { Entity } from "./Entity";
import { Physical } from "./Physical";

export enum ObstacleImageName {
    DEFAULT,
}

export type ObstacleImageSet = Map<ObstacleImageName, ImageAsset>;

export class Obstacle extends Entity implements Physical {
    public physics: SatPhysicsProxy;
    public physics_id: number | null = null;

    public constructor(
        public readonly game: Game,
        public rect: Rect,
        public images: ObstacleImageSet,
    ) {
        super();
        this.physics = new SatPhysicsProxy(
            this,
            rect,
        );
        this.physics.fixed = true;
    }
    
    public onWorldCollision(distance: Vector2D): void {

    };

    public onCollision(other: PhysicsProxy, collision: Collision): void {

    };

    public update(delta_seconds: number): void {
    }
}