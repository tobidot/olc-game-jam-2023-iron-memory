import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Game } from "../base/Game";
import { WorldMapAreaBorder } from "../consts/Direction";
import { WorldMapAreaType } from "../consts/WorldMapAreaType";
import { Agent } from "./Agent";
import { Entity } from "./Entity";
import { Physical } from "./Physical";
import { Weapon } from "./Weapon";
import { getMonsterSpawnPosition } from "./levels/LevelHelper";

export class WorldMapArea {
    public discovered: boolean = false;
    public weapons: Array<Weapon> = [];

    constructor(
        public position: Vector2D,
        public open_borders: Map<WorldMapAreaBorder, boolean> = new Map([]),
        public type: WorldMapAreaType = WorldMapAreaType.GRAS,
        public entities: Array<Physical & Entity> = [],
        public boss: boolean = false,
    ) {

    }
}

export class WorldMap {

    public size = new Vector2D(40, 25);
    public areas: WorldMapArea[] = [];
    public active_area_coordinate = new Vector2D(0, 0);
    public starting_area_coordinate: Vector2D = new Vector2D(0, 0);

    constructor(
        public readonly game: Game,
    ) {
    }

    /**
     * Restores all enemies after player dies
     */
    public repopulateWorld() {
        this.game.model.world_map.areas.forEach(area => {
            const alive_count = area.entities.reduce((sum, next) => {
                if (!(next instanceof Agent) || next.is_dead || next.is_neutral || next.is_player ) {
                    return sum;
                }
                return sum + 1;
            }, 0);
            if (area.boss && alive_count === 0) {
                // don't respawn boss, if dead
                return;
            }
            area.entities.forEach((entity) => {
                if (entity instanceof Agent && !(entity instanceof Weapon)) {
                    entity.is_dead = false;
                    entity.hitpoints = entity.max_hitpoints;
                    if (!entity.is_neutral) {
                        const position = getMonsterSpawnPosition();
                        entity.physics.shape.setCenter(position);
                    }
                }
            })
        });
    }

    public at(x: number, y: number): WorldMapArea;
    public at(position: Vector2D): WorldMapArea;
    public at(x: number | Vector2D, y?: number): WorldMapArea {
        if (x instanceof Vector2D) {
            return this.at(x.x, x.y);
        }
        if (y === undefined) {
            throw new Error(`Invalid map position ${x}:${y}`);
        }
        if (x < 0 || x >= this.size.x || y < 0 || y >= this.size.y) {
            throw new Error(`Invalid map position ${x}:${y}`);
        }
        return this.areas[x + y * this.size.x];
    }

    public getCurrentArea(): WorldMapArea {
        return this.at(this.active_area_coordinate);
    }


    public getStartingArea(): WorldMapArea {
        return this.at(this.starting_area_coordinate);
    }

    public getBorderPosition(position: Vector2D, border: WorldMapAreaBorder): Vector2D {
        switch (border) {
            case WorldMapAreaBorder.NORTH: return new Vector2D(position.x, (position.y + this.size.y - 1) % this.size.y);
            case WorldMapAreaBorder.SOUTH: return new Vector2D(position.x, (position.y + 1) % this.size.y);
            case WorldMapAreaBorder.EAST: return new Vector2D((position.x + 1) % this.size.x, position.y);
            case WorldMapAreaBorder.WEST: return new Vector2D((position.x + this.size.x - 1) % this.size.x, position.y);
        }
    }

    public getBorderOffset(border: WorldMapAreaBorder): Vector2D {
        switch (border) {
            case WorldMapAreaBorder.NORTH: return new Vector2D(0, - 1);
            case WorldMapAreaBorder.SOUTH: return new Vector2D(0, + 1);
            case WorldMapAreaBorder.WEST: return new Vector2D(- 1, 0);
            case WorldMapAreaBorder.EAST: return new Vector2D(+ 1, 0);
        }
    }

    public isValidPosition(position: Vector2D): boolean {
        return position.x >= 0 && position.x < this.size.x && position.y >= 0 && position.y < this.size.y;
    }

    public update(delta_ms: number): void {
        // do nothing
    }

    public travel(border: WorldMapAreaBorder): WorldMapArea {
        const current_area = this.at(this.active_area_coordinate.x, this.active_area_coordinate.y);
        const next_area_position = this.getBorderPosition(current_area.position, border);
        if (!this.isValidPosition(next_area_position)) {
            throw new Error(`Invalid travel position ${next_area_position.x}:${next_area_position.y}`);
        }
        const next_area = this.at(next_area_position.x, next_area_position.y);
        return this.travelTo(next_area, border);
    }

    public travelTo(new_area: WorldMapArea, from: WorldMapAreaBorder): WorldMapArea {
        this.active_area_coordinate.set(new_area.position);
        // discover next area
        new_area.open_borders.forEach((is_open, border) => {
            if (!is_open) {
                return;
            }
            const position = this.getBorderPosition(new_area.position, border);
            if (!this.isValidPosition(position)) {
                return;
            }
            const area = this.at(position.x, position.y);
            area.discovered = true;
        });
        return new_area;
    }


    public isCleared(): boolean {
        const boss_count = this.areas.reduce((sum, next) => {
            if (!next.boss) {
                return sum;
            }
            const alive_count = next.entities.reduce((sum, next) => {
                if (!(next instanceof Agent) || next.is_dead || next.is_neutral || next.is_player ) {
                    return sum;
                }
                return sum + 1;
            }, 0);
            if (alive_count === 0) {
                return sum;
            }
            return sum + 1;
        }, 0);
        return boss_count === 0;
    }

}