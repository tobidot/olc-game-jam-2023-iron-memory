import { Vector2D } from "../../../library/math";
import { Rect } from "../../../library/math/Rect";
import { Game } from "../../base/Game";
import { WorldMapAreaBorder, opposite } from "../../consts/Direction";
import { EnemyType } from "../../consts/EnemyType";
import { WorldMapAreaType } from "../../consts/WorldMapAreaType";
import { Agent } from "../Agent";
import { WorldMap, WorldMapArea } from "../WorldMap";


/**
 * Set the starting point which is a village 
 * @param game 
 * @param world_map 
 * @param position 
 * @returns 
 */
export function setStartingPosition(game: Game, world_map: WorldMap, position: Vector2D): WorldMapArea {
    // turn into village
    const starting_area = game.model.world_map.at(position);
    starting_area.type = WorldMapAreaType.VILLAGE;
    starting_area.discovered = true;
    starting_area.entities = starting_area.entities.filter(entity => !(entity instanceof Agent) || (!!entity.is_player || entity.is_neutral));

    // reveal neighbours
    starting_area.open_borders.forEach((is_open, border) => {
        if (!is_open) {
            return;
        }
        const position = world_map.getBorderPosition(starting_area.position, border);
        if (!world_map.isValidPosition(position)) {
            return;
        }
        const border_area = world_map.at(position.x, position.y);
        border_area.discovered = true;
    });

    // generate obstacles for village
    generateObstacle(game, world_map, position.x, position.y);

    world_map.active_area_coordinate.set(position);
    world_map.starting_area_coordinate.set(position);
    game.controller.travelTo(starting_area);
    return starting_area;
}

/**
 * Creat the obstacles for the areas to block sideways
 * @param game 
 * @param world_map 
 */
export function generateObstacles(
    game: Game,
    world_map: WorldMap,
) {
    for (let y = 0; y < world_map.size.y; y++) {
        for (let x = 0; x < world_map.size.x; x++) {
            generateObstacle(game, world_map, x, y);
        }
    }
}

/**
 * Generate the obstacles for the area
 * @param game 
 * @param world_map 
 * @param x 
 * @param y 
 */
export function generateObstacle(
    game: Game,
    world_map: WorldMap,
    x: number, y: number
) {
    const area = world_map.at(x, y);
    // spawn environment blocking the paths
    area.open_borders.forEach((is_open, border) => {
        const walkable_area = world_map.game.model.walkable_area.area;
        const width = (border === WorldMapAreaBorder.NORTH || border === WorldMapAreaBorder.SOUTH)
            ? walkable_area.width
            : 100;
        const height = (border === WorldMapAreaBorder.NORTH || border === WorldMapAreaBorder.SOUTH)
            ? 75
            : walkable_area.height;
        const border_position = world_map.getBorderPosition(area.position, border);
        const border_area = world_map.at(border_position.x, border_position.y);


        const direction = world_map.getBorderOffset(border);
        const left = direction.cpy().mul({ x: height, y: width }).rotate(-Math.PI / 2).mul(0.5);
        const right = direction.cpy().mul({ x: height, y: width }).rotate(Math.PI / 2).mul(0.5);
        // pointing to the center at the edge of the border
        const target_center = direction.cpy()
            .add(walkable_area.center)
            .add(direction.cpy().mul(walkable_area.size).mul(0.5))
            .add(direction.cpy().mul({ x: width, y: height }).mul(-0.5));
        const target_rect = Rect.fromCenterAndSize(target_center, { x: width, y: height });
        if (is_open) {

            const area_types = [area.type, border_area.type];
            const make_obstacle = (position: Vector2D) => {
                switch (area_types[(Math.floor(Math.random() * 2))]) {
                    case WorldMapAreaType.DUNGEON: return world_map.game.model.obstacle_factory.makeDungeon(position);
                    case WorldMapAreaType.FORREST: return world_map.game.model.obstacle_factory.makeForrest(position);
                    case WorldMapAreaType.GRAS: return world_map.game.model.obstacle_factory.makeGras(position);
                    case WorldMapAreaType.MOUNTAIN: return world_map.game.model.obstacle_factory.makeMountain(position);
                    case WorldMapAreaType.VILLAGE: return world_map.game.model.obstacle_factory.makeVillage(position);
                }
            }
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
            const make_obstacle = (position: Vector2D) => {
                switch (area.type) {
                    case WorldMapAreaType.DUNGEON: return world_map.game.model.obstacle_factory.makeDungeon(position);
                    case WorldMapAreaType.FORREST: return world_map.game.model.obstacle_factory.makeForrest(position);
                    case WorldMapAreaType.GRAS: return world_map.game.model.obstacle_factory.makeGras(position);
                    case WorldMapAreaType.MOUNTAIN: return world_map.game.model.obstacle_factory.makeMountain(position);
                    case WorldMapAreaType.VILLAGE: return world_map.game.model.obstacle_factory.makeVillage(position);
                }
            }
            const position = target_center.cpy()
                .add(left.cpy().mul(i / 4 + Math.random() * 0.05))
                .add(direction.cpy().mul(Math.random() * 100 - 50));
            const obstacle = make_obstacle(position);
            area.entities.push(obstacle);
        }
    });
}


/**
 * 
 */
export interface WorldMapLevelDefinition {
    size: Vector2D,
    start: Vector2D,
    areas: WorldMapLevelAreaDefinition[],
}

/**
 * 
 */
export interface WorldMapLevelAreaDefinition {
    type: WorldMapAreaType,
    open_borders: number,
    boss?: boolean,
    x?: number,
    y?: number,
    entities: {
        type: EnemyType,
        count?: number,
        position?: Vector2D;
        info?: Array<string>,
    }[],
}

/**
 * Load the world map from an structured object
 */
export function loadWorldFromObject(
    game: Game,
    world_map: WorldMap,
    definition: WorldMapLevelDefinition,
) {
    world_map.areas = [];
    world_map.size.set(definition.size);
    for (let y = 0; y < world_map.size.y; y++) {
        for (let x = 0; x < world_map.size.x; x++) {
            const area_definition = definition.areas[x + y * world_map.size.x];
            if (!area_definition) {
                throw new Error(`Invalid world map definition - missing area (${x}:${y})`);
            }
            if (area_definition.x !== undefined && area_definition.x !== x ||
                area_definition.y !== undefined && area_definition.y !== y) {
                throw new Error(`Invalid world map definition - area position mismatch (${x}:${y})`);
            }
            world_map.areas.push(loadAreaFromObject(game, world_map, x, y, area_definition));
        }
    }
    setStartingPosition(game, game.model.world_map, definition.start);
}

/**
 * Generate an area from an object definition
 * @param game 
 * @param world_map 
 * @param x 
 * @param y 
 * @param definition 
 * @returns 
 */
function loadAreaFromObject(
    game: Game,
    world_map: WorldMap,
    x: number, y: number,
    definition: WorldMapLevelAreaDefinition,
): WorldMapArea {
    // build the borders
    const borders = new Map<WorldMapAreaBorder, boolean>([
        [WorldMapAreaBorder.NORTH, !!(definition.open_borders & WorldMapAreaBorder.NORTH)],
        [WorldMapAreaBorder.SOUTH, !!(definition.open_borders & WorldMapAreaBorder.SOUTH)],
        [WorldMapAreaBorder.WEST, !!(definition.open_borders & WorldMapAreaBorder.WEST)],
        [WorldMapAreaBorder.EAST, !!(definition.open_borders & WorldMapAreaBorder.EAST)],
    ]);
    // build entities in area
    const entities = definition.entities.flatMap((entity_definition) => {
        const count = entity_definition.count || 1;
        const entities: Array<Agent> = [];
        for (let i = 0; i < count; i++) {
            const position = entity_definition.position ?? getMonsterSpawnPosition();
            const info_factory = game.model.info_factory;
            const factory = game.model.creep_factory;
            const entity = (() => {
                switch (entity_definition.type) {
                    case EnemyType.INFO: return info_factory.makeInfo(position, entity_definition.info || []);
                    case EnemyType.GOBLIN: return factory.makeGoblin(position);
                    case EnemyType.HOB_GOBLIN: return factory.makeHobGoblin(position);
                    default: throw new Error(`Invalid entity type ${entity_definition.type}`);
                }
            })();
            entities.push(entity);
        }
        return entities;
    });
    const area = new WorldMapArea(
        new Vector2D(x, y),
        borders,
        definition.type,
        entities,
        definition.boss || false,
    );
    return area;
}

/**
 * Verify that the map makes sense, 
 * that all areas are connected and reachable
 * and borders always match
 * @param game 
 * @param world_map 
 */
export function mapCheck(
    game: Game,
    world_map: WorldMap,
    repair: boolean = false,
) {
    const visited = new Set<string>();
    const queue = new Array<WorldMapArea>();
    const errors = new Array<Error>();
    queue.push(world_map.at(world_map.starting_area_coordinate));
    while (queue.length > 0) {
        const area = queue.shift();
        if (!area) {
            throw new Error("Invalid world map - area missing");
        }
        const key = `${area.position.x}:${area.position.y}`;
        if (visited.has(key)) {
            continue;
        }
        visited.add(key);
        area.open_borders.forEach((is_open, border) => {
            if (!is_open) {
                return;
            }
            const position = world_map.getBorderPosition(area.position, border);
            if (!world_map.isValidPosition(position)) {
                if (repair) {
                    // close the border to nowhere
                    area.open_borders.set(border, false);
                } else {
                    errors.push(new Error(`Invalid world map - area ${area.position.x}:${area.position.y} has invalid border to nowhere ${border} (${WorldMapAreaBorder[border]})`));
                    return;
                }
            }
            const border_area = world_map.at(position.x, position.y);
            if (!border_area.open_borders.get(opposite(border))) {
                if (repair) {
                    // open the border from the other side
                    area.open_borders.set(border, true);
                    border_area.open_borders.set(opposite(border), true);
                } else {
                    errors.push(new Error(`Invalid world map - area ${area.position.x}:${area.position.y} has invalid border mismatch ${border} (${WorldMapAreaBorder[border]})`));
                }
            }
            queue.push(border_area);
        });
    }
    if (errors.length > 0) {
        errors.forEach(console.error);
        console.error("Invalid world map", errors.map(error => error.message).join("\n "));
        throw new Error(`Invalid world map - ${errors.length} errors`);
    }

    const get_border_towards_starting_area = (position: Vector2D): WorldMapAreaBorder => {
        const direction = world_map.starting_area_coordinate.cpy().sub(position);
        if (Math.abs(direction.x) > Math.abs(direction.y)) {
            return direction.x > 0 ? WorldMapAreaBorder.EAST : WorldMapAreaBorder.WEST;
        } else {
            return direction.y > 0 ? WorldMapAreaBorder.SOUTH : WorldMapAreaBorder.NORTH;
        }
    };
    // check if all areas are reached and throw if not
    const unreachable = new Array<WorldMapArea>();
    for (let y = 0; y < world_map.size.y; y++) {
        for (let x = 0; x < world_map.size.x; x++) {
            const area = world_map.at(x, y);
            const key = `${area.position.x}:${area.position.y}`;
            if (!visited.has(key)) {
                if (repair) {
                    // open border towards the starting area until it is reachable
                    const position = area.position.cpy();
                    while (!visited.has(`${position.x}:${position.y}`)) {
                        // open border 
                        let border = get_border_towards_starting_area(position);
                        const current_area = world_map.at(position);
                        current_area.open_borders.set(border, true);
                        // move towards the starting area and open the opposite area
                        position.add(world_map.getBorderOffset(border));
                        const border_area = world_map.at(position);
                        border_area.open_borders.set(opposite(border), true);
                    }
                } else {
                    unreachable.push(area);
                }
            }
        }
    }
    if (unreachable.length > 0) {
        console.error("Unreachable areas", unreachable);
        throw new Error(`Invalid world map - ${unreachable.length} areas are unreachable ${unreachable.map(area => `${area.position.x}:${area.position.y}`).join(", ")}`);
    }
}

export function getMonsterSpawnPosition() {
    return new Vector2D(
        Math.floor(Math.random() * 300 + 250),
        Math.floor(Math.random() * 250 + 175),
    );
}