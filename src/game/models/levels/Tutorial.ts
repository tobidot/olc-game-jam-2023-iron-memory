import { Vector2D } from "../../../library/math";
import { Rect } from "../../../library/math/Rect";
import { Game } from "../../base/Game";
import { WorldMapAreaBorder } from "../../consts/Direction";
import { EnemyType } from "../../consts/EnemyType";
import { WorldMapAreaType } from "../../consts/WorldMapAreaType";
import { Agent } from "../Agent";
import { WorldMap, WorldMapArea } from "../WorldMap";
import { WorldMapLevelDefinition, generateObstacles, loadWorldFromObject, mapCheck, setStartingPosition } from "./LevelHelper";

export function loadTutorial(
    game: Game,
) {
    loadWorldFromObject(game, game.model.world_map, getDefinition())
    generateObstacles(game, game.model.world_map);
    mapCheck(game, game.model.world_map);
}

function getDefinition(): WorldMapLevelDefinition {
    const N = WorldMapAreaBorder.NORTH;
    const S = WorldMapAreaBorder.SOUTH;
    const W = WorldMapAreaBorder.WEST;
    const E = WorldMapAreaBorder.EAST;
    const enemy_pack_1 = [
        { type: EnemyType.GOBLIN, count: 1 },
    ];
    const enemy_pack_2 = [
        { type: EnemyType.GOBLIN, count: 4 },
    ];
    const enemy_pack_3 = [
        { type: EnemyType.HOB_GOBLIN, count: 1 },
        { type: EnemyType.GOBLIN, count: 2 },
    ];
    return {
        size: new Vector2D(3, 3),
        start: new Vector2D(1, 1),
        areas: [
            { type: WorldMapAreaType.GRAS, open_borders: S | E, entities: enemy_pack_2 },
            { type: WorldMapAreaType.FORREST, open_borders: E | W, entities: enemy_pack_1 },
            { type: WorldMapAreaType.FORREST, open_borders: W, entities: enemy_pack_1, x: 2, y: 0 },
            { type: WorldMapAreaType.GRAS, open_borders: N | S | E, entities: enemy_pack_1 },
            { type: WorldMapAreaType.VILLAGE, open_borders: W | E, entities: [], x: 1, y: 1, }, // start
            { type: WorldMapAreaType.DUNGEON, open_borders: W, entities: enemy_pack_3 },
            { type: WorldMapAreaType.GRAS, open_borders: N | E, entities: enemy_pack_1 },
            { type: WorldMapAreaType.FORREST, open_borders: W | E , entities: enemy_pack_1 },
            { type: WorldMapAreaType.FORREST, open_borders: W, entities: enemy_pack_2 },
        ]
    }
}
