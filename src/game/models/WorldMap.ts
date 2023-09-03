import { Vector2D } from "../../library/math";
import { WorldMapAreaBorder } from "../consts/Direction";
import { WorldMapAreaType } from "../consts/WorldMapAreaType";
import { Agent } from "./Agent";

export class WorldMapArea {
    public discovered: boolean = false;

    constructor(
        public position: Vector2D,
        public open_borders: Map<WorldMapAreaBorder, boolean> = new Map([]),
        public type: WorldMapAreaType = WorldMapAreaType.GRAS,
        public enemies: Array<Agent> = [],
    ) {

    }
}

export class WorldMap {

    public readonly size = new Vector2D(40, 25);
    public areas: WorldMapArea[] = [];
    public active_area_coordinate = new Vector2D(Math.floor(this.size.x / 2), Math.floor(this.size.y / 2));

    constructor() {
        this.generateWorld();
    }

    public generateWorld(): void {
        this.areas = [];
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                const types = [
                    WorldMapAreaType.GRAS,
                    WorldMapAreaType.DUNGEON,
                    WorldMapAreaType.FORREST,
                    WorldMapAreaType.MOUNTAIN,
                ];
                const area_type = types[Math.floor(Math.random() * types.length)];
                //
                const west_area = x > 0 ? this.areas[x - 1 + y * this.size.x] : null;
                const west_open = west_area ? !!west_area.open_borders.get(WorldMapAreaBorder.EAST) : false;
                const north_area = y > 0 ? this.areas[x + (y - 1) * this.size.x] : null;
                const north_open = north_area ? !!north_area.open_borders.get(WorldMapAreaBorder.SOUTH) : false;
                const open_borders = (north_open ? 1 : 0) + (west_open ? 1 : 0);
                const east_open = x < this.size.x - 1 && (Math.random() > (4 - open_borders) / 8);
                const south_open = y < this.size.y - 1 && ((!north_open && !west_open && !east_open) || (Math.random() > (4-open_borders) / 8) );
                const borders = new Map<WorldMapAreaBorder, boolean>([
                    [WorldMapAreaBorder.NORTH, north_open],
                    [WorldMapAreaBorder.SOUTH, south_open],
                    [WorldMapAreaBorder.WEST, west_open],
                    [WorldMapAreaBorder.EAST, east_open],
                ]);
                const area = new WorldMapArea(
                    new Vector2D(x, y),
                    borders,
                    area_type,
                );
                this.areas.push(area);
            }
        }
        // set up starting position
        const center = this.at(Math.floor(this.size.x / 2), Math.floor(this.size.y / 2));
        center.type = WorldMapAreaType.VILLAGE;
        center.discovered = true;
        center.enemies = [];
        center.open_borders.forEach((is_open, border) => {
            if (!is_open) {
                return;
            }
            const position = this.getBorderPosition(center.position, border);
            if (!this.isValidPosition(position)) {
                return;
            }
            const area = this.at(position.x, position.y);
            area.discovered = true;
        });
    }

    public at(x: number, y: number): WorldMapArea {
        if (x < 0 || x >= this.size.x || y < 0 || y >= this.size.y) {
            throw new Error(`Invalid map position ${x}:${y}`);
        }
        return this.areas[x + y * this.size.x];
    }

    public getBorderPosition(position: Vector2D, border: WorldMapAreaBorder): Vector2D {
        switch (border) {
            case WorldMapAreaBorder.NORTH: return new Vector2D(position.x, position.y - 1);
            case WorldMapAreaBorder.SOUTH: return new Vector2D(position.x, position.y + 1);
            case WorldMapAreaBorder.WEST: return new Vector2D(position.x - 1, position.y);
            case WorldMapAreaBorder.EAST: return new Vector2D(position.x + 1, position.y);
        }
    }

    public isValidPosition(position: Vector2D): boolean {
        return position.x >= 0 && position.x < this.size.x && position.y >= 0 && position.y < this.size.y;
    }

    public update(delta_ms: number): void {
        // do nothing
    }
    
    public travel(border: WorldMapAreaBorder) : void {
        const current_area = this.at(this.active_area_coordinate.x, this.active_area_coordinate.y);
        const next_area_position = this.getBorderPosition(current_area.position, border);
        if (!this.isValidPosition(next_area_position)) {
            throw new Error(`Invalid travel position ${next_area_position.x}:${next_area_position.y}`);
        }
        const next_area = this.at(next_area_position.x, next_area_position.y);
        this.active_area_coordinate = next_area_position;
        // discover next area
        next_area.open_borders.forEach((is_open, border) => {
            if (!is_open) {
                return;
            }
            const position = this.getBorderPosition(next_area.position, border);
            if (!this.isValidPosition(position)) {
                return;
            }
            const area = this.at(position.x, position.y);
            area.discovered = true;
        });
    }

}