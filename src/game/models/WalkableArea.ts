import { AABBPhysicsEngine, AABBPhysicsProxy } from "../../library";
import { Rect } from "../../library/math/Rect";
import { Entity } from "./Entity";

export class WalkableArea {
    //
    public readonly size: Rect = Rect.fromCenterAndSize({ x: 400, y: 300 }, { x: 800, y: 600 });
    public physics: AABBPhysicsEngine;
    public entities: Array<Entity> = [];

    constructor() {
        this.physics = new AABBPhysicsEngine({
            world_box: this.size,
            simple_collisions: false,
        });
    }

    
     /**
     * Add a new entity to the walkable area
     * @param label 
     * @returns 
     */
     public addEntity<T extends Entity>(
        entity: T,
    ): T {
        if (this.entities.length > 300 ) {
            console.warn("Too many entities");
            return entity;
        }
        this.entities.push(entity);
        if ('physics_id' in entity && 'physics' in entity && entity.physics instanceof AABBPhysicsProxy) {
            entity.physics_id = this.physics.add(entity.physics).id;
        }
        return entity;
    }

    /**
     * Remove an entity from the current area
     * @param entity 
     */
    public removeEntity(entity: Entity) {
        if ('physics_id' in entity && typeof entity.physics_id === "number") {
            this.physics.remove(entity.physics_id);
        }
        this.entities = this.entities.filter(e => e.id !== entity.id);
    }
    
    /**
     * Removes all entities from the walkable area
     */
    public clear() {
        this.physics.reset();
        this.entities = [];
    }
}