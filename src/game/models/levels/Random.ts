import { Vector2D } from "../../../library/math";
import { Rect } from "../../../library/math/Rect";
import { Game } from "../../base/Game";
import { WorldMapAreaBorder } from "../../consts/Direction";
import { EnemyType } from "../../consts/EnemyType";
import { WorldMapAreaType } from "../../consts/WorldMapAreaType";
import { Agent } from "../Agent";
import { WorldMap, WorldMapArea } from "../WorldMap";
import { generateObstacles, getMonsterSpawnPosition, makeEnemy, mapCheck, setStartingPosition } from "./LevelHelper";

export function loadRandom(
    game: Game,
    size: Vector2D,
) {
    // generate the area types and enemies
    generateWorld(game, game.model.world_map, size);

    // set up starting position at a random location more to the center
    let starting_position: Vector2D|null = null;
    while (starting_position === null) {
        const random_position = new Vector2D(
            Math.floor(Math.random() * game.model.world_map.size.x / 2 + game.model.world_map.size.x / 4),
            Math.floor(Math.random() * game.model.world_map.size.y / 2 + game.model.world_map.size.y / 4),
        );
        const area = game.model.world_map.at(random_position);
        if (!area.boss) {
            starting_position = (random_position);
        }
    }
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
    // add potions
    const potion_count = (size.x + size.y) / 2;
    for (let i = 0; i < potion_count; i++) {
        const area = world_map.areas[Math.floor(Math.random() * world_map.areas.length)];
        const position = getMonsterSpawnPosition();
        area.entities.push(game.model.potion_factory.makePotion(position));
    }


    const entity_cost = new Map<EnemyType, number>([
        [EnemyType.ORC, 1],
        [EnemyType.HOB_GOBLIN, 1],
        [EnemyType.TROLL, 1],
        [EnemyType.DEMON, 2],
        [EnemyType.LICH, 2],
        [EnemyType.DRAGON, 3],
    ]);
    const entity_types = Array.from(entity_cost.keys());
    let boss_value = Math.ceil((((size.x + size.y) / 5) ** 1.5));
    let boss_levels = getBossLevelPattern(boss_value);

    boss_levels.forEach((boss_value, index) => {
        let position: Vector2D | null = null;
        let area: WorldMapArea | null = null;
        // try to find a position for the boss
        while (position === null || area === null) {
            // take a random area with slight bias towards the edges
            const x = Math.floor((((Math.random() + Math.random() + 1) / 2) % 1) * world_map.size.x);
            const y = Math.floor((((Math.random() + Math.random() + 1) / 2) % 1) * world_map.size.y);
            const random_position = new Vector2D(x, y);
            area = world_map.at(random_position);
            if (!area.boss && area.type !== WorldMapAreaType.VILLAGE) {
                // only if the area is not already a boss area
                position = random_position;
            }
        }
        // mark the area as boss 
        area.boss = true;
        // spawn bosses in the area based on the boss value
        while (boss_value > 0) {
            const entity_type = entity_types[Math.floor(Math.random() * entity_types.length)];
            const cost = entity_cost.get(entity_type) ?? 1;
            if (cost > boss_value) {
                // if the boss value is not enough for the entity, skip it
                continue;
            }
            boss_value -= cost;
            const position = getMonsterSpawnPosition();
            area.entities.push(makeEnemy(game, entity_type, position));
        }
    });
}

/**
 * 
 * @param total 
 * @returns 
 */
function getBossLevelPattern(total: number): number[] {
    if (total <= 0) {
        throw new Error("Input number must be a positive integer.");
    }

    // always have a 1 at the beginning
    const result: number[] = [1];
    total--;

    // whiler there is still value to distribute
    while (total > 0) {
        if (total <= 2) {
            // if there is only 1 or 2 left, just add it
            result.push(total);
            break;
        }

        // get a random divisor between 1 and total - 1
        const divisor = Math.ceil(Math.random() * (total - 1));
        // make sure to not add more than half of the remaining value
        const part = Math.min(divisor, total - divisor);

        // add the part to the result and subtract it from the total
        result.push(part);
        total -= part;
    }

    return result.sort((a, b) => a - b);
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
    const terrain_difficulty = Math.floor(Math.random() * {
        [WorldMapAreaType.DUNGEON]: 30,
        [WorldMapAreaType.FORREST]: 25,
        [WorldMapAreaType.GRAS]: 18,
        [WorldMapAreaType.MOUNTAIN]: 22,
        [WorldMapAreaType.VILLAGE]: 0,
    }[area_type]);
    const diff = new Vector2D((x - world_map.size.x / 2), (y - world_map.size.y / 2));
    // 0 to 1 depending on distance from center
    const difficulty = diff.mul({ x: 2 / world_map.size.x, y: 2 / world_map.size.y }).length() ** 1.2;
    let entity_value = Math.floor(Math.random() * terrain_difficulty * difficulty * 0.75) + terrain_difficulty * 0.25 + 3;

    const entity_cost = new Map<EnemyType, number>([
        [EnemyType.GOBLIN, 3],
        [EnemyType.SPIDER, 3],
        [EnemyType.IMP, 5],
    ]);
    const entity_types = Array.from(entity_cost.keys());
    while (entity_value >= 3) {
        const entity_type = entity_types[Math.floor(Math.random() * entity_types.length)];
        const position = getMonsterSpawnPosition();
        area.entities.push(makeEnemy(game, entity_type, position));
        entity_value -= entity_cost.get(entity_type) ?? 1;
    }

    return area;
}
