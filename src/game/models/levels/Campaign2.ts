import { Vector2D } from "../../../library/math";
import { Game } from "../../base/Game";
import { WorldMapAreaBorder } from "../../consts/Direction";
import { EnemyType } from "../../consts/EnemyType";
import { WorldMapAreaType } from "../../consts/WorldMapAreaType";
import { loadWorldFromObject, generateObstacles, mapCheck, WorldMapLevelDefinition } from "./LevelHelper";

export function loadCampaign2(
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

    const sign_multi_boss = {
        type: EnemyType.INFO,
        info: [
            "This level has three bosses",
            "Bosses do not respawn if you die",
            "Consider which one you want to fight first",
        ]
    };
    const sign_potion = {
        type: EnemyType.INFO,
        info: [
            "You found a potion",
            "Attack it to heal yourself",
            "It will respawn after you die",
        ]
    };

    const village = [sign_multi_boss];
    const nothing = [];
    const goblin_weak = [
        { type: EnemyType.GOBLIN, count: 2 },
    ];
    const goblin_strong = [
        { type: EnemyType.GOBLIN, count: 4 },
    ];
    const spider_weak = [
        { type: EnemyType.SPIDER, count: 1 },
    ];
    const spider_medium = [
        { type: EnemyType.SPIDER, count: 3 },
    ];
    const spider_strong = [
        { type: EnemyType.GOBLIN, count: 2 },
        { type: EnemyType.SPIDER, count: 5 },
    ];
    const imp_weak = [
        { type: EnemyType.IMP, count: 1 },
    ];
    const imp_medium = [
        { type: EnemyType.IMP, count: 2 },
        { type: EnemyType.SPIDER, count: 1 },
    ];
    const imp_strong = [
        { type: EnemyType.IMP, count: 3 },
    ];
    const boss_orc = [
        { type: EnemyType.ORC, count: 1 },
    ];
    const boss_troll = [
        { type: EnemyType.TROLL, count: 1 },
    ];
    const boss_hob_goblin = [
        { type: EnemyType.HOB_GOBLIN, count: 1 },
    ];
    const potion = [
        { type: EnemyType.POTION, count: 1 },
        sign_potion,
    ];
    return {
        size: new Vector2D(5, 5),
        start: new Vector2D(2, 1),
        areas: [
            { type: G, open_borders: S | E, entities: goblin_weak },
            { type: G, open_borders: W | S, entities: goblin_weak },
            { type: G, open_borders: S | E, entities: goblin_strong },
            { type: D, open_borders: W | E, entities: imp_weak },
            { type: D, open_borders: W | S, entities: imp_medium },
            //
            { type: G, open_borders: N | E, entities: goblin_weak },
            { type: G, open_borders: N | E | W, entities: goblin_weak, }, // start
            { type: V, open_borders: N | S | W, entities: village, x: 2, y: 1 }, // start
            { type: D, open_borders: S, entities: potion },
            { type: D, open_borders: S | N, entities: imp_weak },
            //
            { type: F, open_borders: S | E, entities: spider_medium },
            { type: F, open_borders: S | W, entities: spider_medium },
            { type: F, open_borders: N | S, entities: goblin_strong, x: 2, y: 2 }, // start
            { type: D, open_borders: N | E, entities: boss_orc, boss: true },
            { type: D, open_borders: N | W, entities: imp_medium },
            //
            { type: F, open_borders: N | E, entities: spider_medium },
            { type: F, open_borders: N | S | W | E, entities: spider_weak },
            { type: F, open_borders: N | S | W | E, entities: spider_weak },
            { type: M, open_borders: W | E, entities: goblin_strong },
            { type: M, open_borders: S | W, entities: goblin_strong },
            //
            { type: F, open_borders: E, entities: potion },
            { type: F, open_borders: W | N, entities: boss_troll, boss: true },
            { type: F, open_borders: N, entities: spider_strong },
            { type: M, open_borders: E, entities: potion },
            { type: M, open_borders: N | W, entities:  boss_hob_goblin, boss: true  },
        ]
    }
}