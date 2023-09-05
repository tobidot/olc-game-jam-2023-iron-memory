import { Vector2D } from "../../../library/math";
import { Game } from "../../base/Game";
import { WorldMapAreaBorder } from "../../consts/Direction";
import { EnemyType } from "../../consts/EnemyType";
import { WorldMapAreaType } from "../../consts/WorldMapAreaType";
import { loadWorldFromObject, generateObstacles, mapCheck, WorldMapLevelDefinition } from "./LevelHelper";

export function loadCampaign3(
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
    // 
    const G = WorldMapAreaType.GRAS;
    const F = WorldMapAreaType.FORREST;
    const D = WorldMapAreaType.DUNGEON;
    const M = WorldMapAreaType.MOUNTAIN;
    const V = WorldMapAreaType.VILLAGE;

    const sign_dragon_boss = {
        type: EnemyType.INFO,
        info: [
            "These lands are guarded \nby a mighty dragon",
            "It is the strongest \nsingle enemy you will face",
        ]
    };

    const village = [sign_dragon_boss];
    const nothing = [];
    const goblin_weak = [
        { type: EnemyType.GOBLIN, count: 1 },
    ];
    const goblin_strong = [
        { type: EnemyType.GOBLIN, count: 3 },
    ];
    const spider_strong = [
        { type: EnemyType.SPIDER, count: 10 },
    ];
    const imp_weak = [
        { type: EnemyType.IMP, count: 2 },
    ];
    const imp_medium = [
        { type: EnemyType.IMP, count: 3 },
        { type: EnemyType.GOBLIN, count: 1 },
    ];
    const imp_strong = [
        { type: EnemyType.IMP, count: 3 },
    ];
    const goblin_guard = [
        { type: EnemyType.GOBLIN, count: 7 },
    ];
    const potion = [
        { type: EnemyType.GOBLIN, count: 3 },
        { type: EnemyType.POTION, count: 2 },
    ];
    const boss_dragon = [
        { type: EnemyType.DRAGON, count: 1 },
    ];
    return {
        size: new Vector2D(4, 4),
        start: new Vector2D(1, 1),
        areas: [
            { type: G, open_borders: S | E, entities: goblin_weak },
            { type: G, open_borders: W | E, entities: goblin_strong },
            { type: G, open_borders: W | E, entities: goblin_weak },
            { type: G, open_borders: W | S, entities: goblin_strong },
            //
            { type: G, open_borders: N | E, entities: goblin_weak },
            { type: V, open_borders: S | E | W, entities: village, x:1, y:1}, // start
            { type: F, open_borders: S | W, entities: spider_strong },
            { type: M, open_borders: S | N, entities: potion },
            //
            { type: D, open_borders: S | E, entities: imp_medium},
            { type: D, open_borders: N | W, entities: imp_weak  },
            { type: M, open_borders: N | S | E, entities: potion, }, 
            { type: M, open_borders: N | S | W, entities: goblin_guard },
            //
            { type: D, open_borders: N | E, entities: imp_strong },
            { type: M, open_borders: W | E, entities: potion },
            { type: M, open_borders: N | W | E, entities: goblin_guard },
            { type: M, open_borders: N | W, entities: boss_dragon, boss: true },
        ]
    }
}