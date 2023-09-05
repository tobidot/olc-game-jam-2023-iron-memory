import { Vector2D } from "../../../library/math";
import { Game } from "../../base/Game";
import { WorldMapAreaBorder } from "../../consts/Direction";
import { EnemyType } from "../../consts/EnemyType";
import { WorldMapAreaType } from "../../consts/WorldMapAreaType";
import { loadWorldFromObject, generateObstacles, mapCheck, WorldMapLevelDefinition } from "./LevelHelper";

export function loadCampaign1(
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

    const sign_goblin = {
        type: EnemyType.INFO,
        info: [
            "These are the graslands",
            "This is the realm of the goblins",
            "They are weak, but quick",
            "Killing goblin can grant you physical damage",
        ]
    };

    const sign_spider = {
        type: EnemyType.INFO,
        info: [
            "You are entering a forrest",
            "This is the realm of the spiders",
            "They are weak, but can jump",
            "Killing spiders can grant you fire damage",
        ]
    };

    const sign_imp = {
        type: EnemyType.INFO,
        info: [
            "You are entering a forrest",
            "This is the realm of the spiders",
            "They are weak, but resilliant",
            "Killing imps can grant you psy damage",
        ]
    };

    const sign_orc = {
        type: EnemyType.INFO,
        info: [
            "Here lives an orc",
            "He has some physical resistance",
            "But you may find \nother types of damage \nuseful against him",
        ]
    };

    const village = [];
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
        { type: EnemyType.SPIDER, count: 2 },
        { type: EnemyType.GOBLIN, count: 1 },
    ];
    const spider_strong = [
        { type: EnemyType.SPIDER, count: 5 },
    ];
    const imp_weak = [
        { type: EnemyType.IMP, count: 1 },
    ];
    const imp_medium = [
        { type: EnemyType.IMP, count: 1 },
        { type: EnemyType.GOBLIN, count: 1 },
    ];
    const imp_strong = [
        { type: EnemyType.IMP, count: 3 },
    ];
    const boss = [
        { type: EnemyType.ORC, count: 1 },
    ];
    return {
        size: new Vector2D(5, 5),
        start: new Vector2D(2, 2),
        areas: [
            { type: G, open_borders: E, entities: goblin_strong },
            { type: G, open_borders: W | E, entities: goblin_weak },
            { type: G, open_borders: S | W | E, entities: goblin_weak },
            { type: G, open_borders: W | E, entities: goblin_weak },
            { type: G, open_borders: W, entities: goblin_strong },
            //
            { type: F, open_borders: S | E, entities: spider_weak },
            { type: F, open_borders: S | W, entities: spider_weak, }, // start
            { type: G, open_borders: S | N, entities: [sign_goblin] },
            { type: D, open_borders: S | E, entities: imp_weak },
            { type: D, open_borders: S | W, entities: imp_weak },
            //
            { type: F, open_borders: N | S | E, entities: spider_weak },
            { type: F, open_borders: N | S | W | E, entities: [sign_spider] },
            { type: V, open_borders: N | S | W | E, entities: village, x: 2, y: 2 }, // start
            { type: D, open_borders: N | S | W | E, entities: [sign_imp] },
            { type: D, open_borders: N | S | W, entities: imp_weak },
            //
            { type: F, open_borders: N | S | E, entities: spider_weak },
            { type: F, open_borders: N | S | W, entities: spider_medium },
            { type: G, open_borders: N | S, entities: [...nothing, sign_orc] },
            { type: D, open_borders: N | S | E, entities: imp_weak },
            { type: D, open_borders: N | S | W, entities: imp_medium },
            //
            { type: F, open_borders: N | E, entities: spider_strong },
            { type: F, open_borders: N | W, entities: spider_medium },
            { type: G, open_borders: N, entities: boss, boss: true },
            { type: D, open_borders: N | E, entities: imp_medium },
            { type: D, open_borders: N | W, entities: imp_strong },
        ]
    }
}