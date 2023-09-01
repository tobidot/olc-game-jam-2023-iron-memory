import { Vector2D } from "../../library/math";
import { WorldMapAreaType } from "../consts/WorldMapAreaType";
import { Agent } from "./Agent";

export class WorldMapArea {
    constructor(
        public position: Vector2D,
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
        this.generate_world();
    }

    public generate_world(): void {
        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                const area = new WorldMapArea(new Vector2D(x, y));
                const types = [
                    WorldMapAreaType.GRAS,
                    WorldMapAreaType.DUNGEON,
                    WorldMapAreaType.FORREST,
                    WorldMapAreaType.MOUNTAIN,
                ];
                area.type = types[Math.floor(Math.random() * types.length)];
                this.areas.push(area);
            }
        }
        const center = this.at(Math.floor(this.size.x / 2), Math.floor(this.size.y / 2));
        center.type = WorldMapAreaType.VILLAGE;
        center.enemies = [];
    }

    public at(x: number, y: number): WorldMapArea {
        if (x < 0 || x >= this.size.x || y < 0 || y >= this.size.y) {
            throw new Error(`Invalid map position ${x}:${y}`);
        }
        return this.areas[x + y * this.size.x];
    }

    public update(delta_ms: number): void {
        // do nothing
    }


}