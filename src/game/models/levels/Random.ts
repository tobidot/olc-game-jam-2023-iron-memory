import { Vector2D } from "../../../library/math";
import { Rect } from "../../../library/math/Rect";
import { Game } from "../../base/Game";
import { WorldMapAreaBorder } from "../../consts/Direction";
import { WorldMapAreaType } from "../../consts/WorldMapAreaType";
import { Agent } from "../Agent";
import { WorldMap, WorldMapArea } from "../WorldMap";
import { generateObstacles, getMonsterSpawnPosition, mapCheck, setStartingPosition } from "./LevelHelper";

export function loadRandom(
    game: Game,
    size: Vector2D,
) {
    // generate the area types and enemies
    generateWorld(game, game.model.world_map, size);
    
    // set up starting position at a random location more to the center
    const starting_position = new Vector2D(
        Math.floor(Math.random() * game.model.world_map.size.x / 2 + game.model.world_map.size.x / 4),
        Math.floor(Math.random() * game.model.world_map.size.y / 2 + game.model.world_map.size.y / 4),
    );
    setStartingPosition(game, game.model.world_map, starting_position);

    // try to repair the map, because some areas might be unreachable
    mapCheck(game, game.model.world_map, true);

    // generate path obstacles
    generateObstacles(game, game.model.world_map);
}

function generateWorld(
    game: Game,
    world_map: WorldMap,
    size: Vector2D,
): void {
    world_map.areas = [];
    world_map.size.set(size);
    for (let y = 0; y < world_map.size.y; y++) {
        for (let x = 0; x < world_map.size.x; x++) {
            world_map.areas.push(generateArea(game, world_map, x, y));
        }
    }
}

function generateArea(
    game: Game,
    world_map: WorldMap,
    x: number, y: number,
): WorldMapArea {
    const types = [
        WorldMapAreaType.GRAS,
        WorldMapAreaType.DUNGEON,
        WorldMapAreaType.FORREST,
        WorldMapAreaType.MOUNTAIN,
    ];
    const area_type = types[Math.floor(Math.random() * types.length)];
    //
    const west_area = x > 0 ? world_map.areas[x - 1 + y * world_map.size.x] : null;
    const west_open = west_area ? !!west_area.open_borders.get(WorldMapAreaBorder.EAST) : false;
    const north_area = y > 0 ? world_map.areas[x + (y - 1) * world_map.size.x] : null;
    const north_open = north_area ? !!north_area.open_borders.get(WorldMapAreaBorder.SOUTH) : false;
    const open_borders = (north_open ? 1 : 0) + (west_open ? 1 : 0);
    const east_open = x < world_map.size.x - 1 && (Math.random() > (4 - open_borders) / 8);
    const south_open = y < world_map.size.y - 1 && ((!north_open && !west_open && !east_open) || (Math.random() > (4 - open_borders) / 8));
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
    const difficulty = (x - world_map.size.x / 2) ** 2 + (y - world_map.size.y / 2) ** 2;
    const entity_count = Math.floor(Math.random() * count * (1 + difficulty / 10)) + 1;

    for (let i = 0; i < entity_count; i++) {
        const position = getMonsterSpawnPosition();
        const entity = world_map.game.model.creep_factory.makeGoblin(position);
        area.entities.push(entity);
    }

    return area;
}
