import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Game } from "../base/Game";
import { WorldMapAreaBorder } from "../consts/Direction";
import { WorldMapAreaType } from "../consts/WorldMapAreaType";
import { Agent } from "./Agent";
import { Entity } from "./Entity";
import { Physical } from "./Physical";
import { Weapon } from "./Weapon";

export class WorldMapArea {
    public discovered: boolean = false;
    public weapons: Array<Weapon> = [];

    constructor(
        public position: Vector2D,
        public open_borders: Map<WorldMapAreaBorder, boolean> = new Map([]),
        public type: WorldMapAreaType = WorldMapAreaType.GRAS,
        public entities: Array<Physical & Entity> = [],
    ) {

    }
}

export class WorldMap {

    public readonly size = new Vector2D(40, 25);
    public areas: WorldMapArea[] = [];
    public active_area_coordinate = new Vector2D(Math.floor(this.size.x / 2), Math.floor(this.size.y / 2));

    constructor(
        public readonly game: Game,
    ) {
    }

    public generateWorld(): void {
        this.areas = [];
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                this.areas.push(this.generateArea(x, y));
            }
        }
        // set up starting position
        const center = this.at(Math.floor(this.size.x / 2), Math.floor(this.size.y / 2));
        center.type = WorldMapAreaType.VILLAGE;
        center.discovered = true;
        center.entities = center.entities.filter(entity => !(entity instanceof Agent) || (!!entity.is_player));
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
        
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                this.generateObstacles(x, y);
            }
        }
    }

    public generateArea(x: number, y: number): WorldMapArea {
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
        const south_open = y < this.size.y - 1 && ((!north_open && !west_open && !east_open) || (Math.random() > (4 - open_borders) / 8));
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
        // set up entities in area
        area.entities = [];
        const count = Math.floor(Math.random() * {
            [WorldMapAreaType.DUNGEON]: 30,
            [WorldMapAreaType.FORREST]: 15,
            [WorldMapAreaType.GRAS]: 5,
            [WorldMapAreaType.MOUNTAIN]: 10,
            [WorldMapAreaType.VILLAGE]: 0,
        }[area_type]);
        const difficulty = (x - this.size.x / 2) ** 2 + (y - this.size.y / 2) ** 2;
        const entity_count = Math.floor(Math.random() * count * (1 + difficulty / 10)) + 1;

        const spawn_area = Rect.fromCenterAndSize(
            this.game.model.walkable_area.area.center.cpy(),
            this.game.model.walkable_area.area.size.cpy().mul(0.5)
        );
        for (let i = 0; i < entity_count; i++) {
            const position = new Vector2D(
                Math.floor(Math.random() * spawn_area.width) + spawn_area.left,
                Math.floor(Math.random() * spawn_area.height) + spawn_area.top
            );
            const entity = this.game.model.creep_factory.makeGoblin(position);
            area.entities.push(entity);
        }

        return area;
    }

    public generateObstacles(x: number, y: number) {
        const area = this.at(x, y);
        // spawn environment blocking the paths
        area.open_borders.forEach((is_open, border) => {
            const walkable_area = this.game.model.walkable_area.area;
            const width = (border === WorldMapAreaBorder.NORTH || border === WorldMapAreaBorder.SOUTH)
                ? walkable_area.width
                : 100;
            const height = (border === WorldMapAreaBorder.NORTH || border === WorldMapAreaBorder.SOUTH)
                ? 75
                : walkable_area.height;
            const border_position = this.getBorderPosition(area.position, border);
            const border_area = this.at(border_position.x, border_position.y);


            const direction = this.getBorderOffset(border);
            const left = direction.cpy().mul({ x: height, y: width }).rotate(-Math.PI / 2).mul(0.5);
            const right = direction.cpy().mul({ x: height, y: width }).rotate(Math.PI / 2).mul(0.5);
            const area_types = [area.type, border_area.type];
            const make_obstacle = (position: Vector2D) => {
                switch (area_types[(Math.floor(Math.random() * 2))]) {
                    case WorldMapAreaType.DUNGEON: return this.game.model.obstacle_factory.makeDungeon(position);
                    case WorldMapAreaType.FORREST: return this.game.model.obstacle_factory.makeForrest(position);
                    case WorldMapAreaType.GRAS: return this.game.model.obstacle_factory.makeGras(position);
                    case WorldMapAreaType.MOUNTAIN: return this.game.model.obstacle_factory.makeMountain(position);
                    case WorldMapAreaType.VILLAGE: return this.game.model.obstacle_factory.makeVillage(position);
                }
            }
            // pointing to the center at the edge of the border
            const target_center = direction.cpy()
                .add(walkable_area.center)
                .add(direction.cpy().mul(walkable_area.size).mul(0.5))
                .add(direction.cpy().mul({ x: width, y: height }).mul(-0.5));
            const target_rect = Rect.fromCenterAndSize(target_center, { x: width, y: height });
            if (is_open) {
                for (let i = -3; i < -2; i++) {
                    const position = target_center.cpy()
                        .add(left.cpy().mul(i / 4 + Math.random() * 0.05))
                        .add(direction.cpy().mul(Math.random() * 100 - 50));
                    const obstacle = make_obstacle(position);
                    area.entities.push(obstacle);
                }
                for (let i = 2; i <= 3; i++) {
                    const position = target_center.cpy()
                        .add(left.cpy().mul(i / 4 + Math.random() * 0.05))
                        .add(direction.cpy().mul(Math.random() * 100 - 50));
                    const obstacle = make_obstacle(position);
                    area.entities.push(obstacle);
                }
                return;
            }
            for (let i = -3; i <= 3; i++) {
                const position = target_center.cpy()
                    .add(left.cpy().mul(i / 4 + Math.random() * 0.05))
                    .add(direction.cpy().mul(Math.random() * 100 - 50));
                const obstacle = make_obstacle(position);
                area.entities.push(obstacle);
            }
        });
    }


    public populateWorld() {
        const spawn_area = Rect.fromCenterAndSize(
            this.game.model.walkable_area.area.center.cpy(),
            this.game.model.walkable_area.area.size.cpy().mul(0.5)
        );
        this.game.model.world_map.areas.forEach(area => {
            area.entities.forEach((entity) => {
                if (entity instanceof Agent) {
                    entity.is_dead = false;
                    entity.hitpoints = entity.max_hitpoints;
                    const position = new Vector2D(
                        Math.floor(Math.random() * spawn_area.width) + spawn_area.left,
                        Math.floor(Math.random() * spawn_area.height) + spawn_area.top
                    );
                    entity.physics.shape.setCenter(position);
                }
            })
        });
    }

    public at(x: number, y: number): WorldMapArea {
        if (x < 0 || x >= this.size.x || y < 0 || y >= this.size.y) {
            throw new Error(`Invalid map position ${x}:${y}`);
        }
        return this.areas[x + y * this.size.x];
    }

    public getCurrentArea() : WorldMapArea{
        return this.at(this.active_area_coordinate.x, this.active_area_coordinate.y);
    }

    public getBorderPosition(position: Vector2D, border: WorldMapAreaBorder): Vector2D {
        switch (border) {
            case WorldMapAreaBorder.NORTH: return new Vector2D(position.x, (position.y + this.size.y - 1) % this.size.y);
            case WorldMapAreaBorder.SOUTH: return new Vector2D(position.x, (position.y + 1) % this.size.y);
            case WorldMapAreaBorder.WEST: return new Vector2D((position.x + this.size.x - 1) % this.size.x, position.y);
            case WorldMapAreaBorder.EAST: return new Vector2D((position.x + 1) % this.size.x, position.y);
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

}