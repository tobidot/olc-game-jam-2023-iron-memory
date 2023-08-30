import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";

export class Entity implements PhysicsProxiable {
    public physics: PhysicsProxy;

    public constructor(
        body: Rect,
    ) {
        this.physics = new PhysicsProxy(body, this);
    }

    public onWorldCollision(distance: Vector2D): void {
        // do nothing
    }

    public onCollision(other: PhysicsProxy, collision: Collision): void {
        // do nothing
    }
}