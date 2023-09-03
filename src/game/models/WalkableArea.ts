import { Rect } from "../../library/math/Rect";
import { SatPhysicsEngine, SatPhysicsProxy } from "../../library/physics/SatPhysicsEngine";
import { Agent } from "./Agent";
import { Entity } from "./Entity";

export class WalkableArea {
    //
    public readonly size: Rect = Rect.fromCenterAndSize({ x: 400, y: 315 }, { x: 800, y: 570 });
    public physics: SatPhysicsEngine;
    public entities: Array<Entity> = [];
    public player: Agent | null = null;

    constructor() {
        this.physics = new SatPhysicsEngine({
            world_box: this.size,
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
        if (this.entities.length > 300) {
            console.warn("Too many entities");
            return entity;
        }
        this.entities.push(entity);
        if ('physics_id' in entity && 'physics' in entity && entity.physics instanceof SatPhysicsProxy) {
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
        this.player = null;
    }

    /**
     * Update the walkable area
     * @param delta_seconds 
     */
    public update(delta_seconds: number) {
        this.physics.update(delta_seconds);
        this.entities.forEach((entity) => {
            if ('update' in entity && typeof entity.update === "function") {
                entity.update(delta_seconds);
            }
        });
    }
}