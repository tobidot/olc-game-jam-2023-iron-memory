import { AABBPhysicsProxy, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Shape } from "../../library/math/Shape";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { SatPhysicsProxy } from "../../library/physics/SatPhysicsEngine";
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
    public max_hitpoints: number = 100;
    public attack_cooldown: number = 0;
    public light_attack_delay: number = 0.5;
    public heavy_attack_delay: number = 1.0;
    public movement_speed: number = 100;
    // physics properties
    public physics: SatPhysicsProxy;
    public physics_id: number | null = null;
    // rendering properties
    public images: AgentImageSet;
    public render_box: Rect;
    // 

    public constructor(
        protected game: Game,
        shape: Shape,
        images: AgentImageSet,
        is_player: boolean,
    ) {
        super();
        this.is_player = is_player;
        this.images = images;
        this.render_box = shape.getOuterBox();
        this.physics = new SatPhysicsProxy(
            this,
            shape,
        );
    }

    public update(delta_seconds: number): void {
        this.render_box.center.set(this.physics.shape.getCenter());
        this.attack_cooldown = Math.max(0, this.attack_cooldown - delta_seconds);
    }

    public onWorldCollision(distance: Vector2D): void {
        // do nothing
    }

    public onCollision(other: PhysicsProxy, collision: Collision): void {
        // do nothing
    }
}