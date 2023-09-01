import { AABBPhysicsProxy, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { Game } from "../base/Game";
import { Entity } from "./Entity";

export enum AgentImageName {
    DEFAULT,
}

export type AgentImageSet = Map<AgentImageName, ImageAsset>;

export class Agent extends Entity implements PhysicsProxiable {
    // 'static' game properties
    public is_dead: boolean = false;
    public is_player: boolean = false;
    // game variables
    public hitpoints: number = 100;
    // physics properties
    public hit_box: Rect;
    public velocity: Vector2D = new Vector2D(0, 0);
    public physics: AABBPhysicsProxy;
    public physics_id: number | null = null;
    // rendering properties
    public images: AgentImageSet;
    public render_box: Rect;
    // 

    public constructor(
        protected game: Game,
        body: Rect,
        images: AgentImageSet,
        is_player : boolean,
    ) {
        super();
        this.is_player = is_player;
        this.images = images;
        this.hit_box = body.cpy();
        this.render_box = this.hit_box.cpy();
        this.physics = new AABBPhysicsProxy(
            this.hit_box,
            this.velocity,
            this,
        );
        this.physics.static = true;
    }

    public onWorldCollision(distance: Vector2D): void {
        // do nothing
    }

    public onCollision(other: PhysicsProxy, collision: Collision): void {
        // do nothing
    }
}