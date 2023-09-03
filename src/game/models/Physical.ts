import { AABBPhysicsProxy, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Shape } from "../../library/math/Shape";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { SatPhysicsProxy } from "../../library/physics/SatPhysicsEngine";
import { Game } from "../base/Game";
import { Entity } from "./Entity";

export interface Physical extends PhysicsProxiable {
    // physics properties
    physics: SatPhysicsProxy;
    physics_id: number | null;
    // rendering properties
    // public images: AgentImageSet;
    // public render_box: Rect;
}