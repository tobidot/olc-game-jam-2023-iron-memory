import { Vector2D } from "../../../library/math";
import { Game } from "../../base/Game";
import { WorldMapAreaBorder } from "../../consts/Direction";
import { EnemyType } from "../../consts/EnemyType";
import { WorldMapAreaType } from "../../consts/WorldMapAreaType";
import { Info } from "../Info";
import { WorldMapLevelDefinition, generateObstacles, loadWorldFromObject, mapCheck, setStartingPosition } from "./LevelHelper";

export function loadTutorial(
    game: Game,
) {
    loadWorldFromObject(game, game.model.world_map, getDefinition());
    generateObstacles(game, game.model.world_map);
    mapCheck(game, game.model.world_map);
    // open the first sign automatically
    const starting_area = game.model.world_map.getStartingArea();
    const info_sign = starting_area.entities[0];
    if (info_sign instanceof Info) {
        info_sign.nextText();
    }

}

function getDefinition(): WorldMapLevelDefinition {
    const N = WorldMapAreaBorder.NORTH;
    const S = WorldMapAreaBorder.SOUTH;
    const W = WorldMapAreaBorder.WEST;
    const E = WorldMapAreaBorder.EAST;
    const sign_main_attack = {
        type: EnemyType.INFO,
        position: new Vector2D(400, 300),
        info: [
            "Use [Left Mouse Button] \nto attack",
            "Use [W,A,S,D] or [Arrow-Keys] \nto move",
        ]
    };
    const sign_goblin = {
        type: EnemyType.INFO,
        position: new Vector2D(400, 300),
        info: [
            "This is a goblin",
            "It is one of the weakest enemies",
            "Kill it to get an achievement",
        ]
    };
    const sign_heavy_attack = {
        type: EnemyType.INFO,
        position: new Vector2D(200, 400),
        info: [
            "Use [Right Mouse Button] \nfor an heavy attack",
            "It deals more damage, \nbut is slower",
            "You will need it for enemies \nwith high resistances",
        ]
    };
    const sign_achievements = {
        type: EnemyType.INFO,
        info: [
            "By killing enemies \nor doing other noteworthy things, \nyou will gain achievements",
            "They can be used to improve \nyour weapon",
            "Achievements are linked to your sword \nand will be lost if you die",
            "Some achievements will also \naffect you negatively",
            "The latest achievement will be shown \nin the bottom left corner",
            "You can see all your \ncurrent achivements through \nthe menu item 'Achievements'",
        ]
    };
    const sign_achievement_hint_1 = {
        type: EnemyType.INFO,
        info: [
            "Try discovering the whole map, \nto get an achievement",
            "Press [M] to open the map \nand see where you have been",
        ]
    };
    const sign_achievement_hint_2 = {
        type: EnemyType.INFO,
        info: [
            "Try destroying an info sign \nto get an achievement",
        ]
    };
    const sign_tombstone = {
        type: EnemyType.INFO,
        info: [
            "Should you die, \nyou will respawn in the village",
            "All enemies will respawn, \nexcept bosses",
            "You leave your weapon behind",
            "You can get it back, \nby going to the area you died",
            "Use [SPACEBAR] to swap weapon, \nwhile near it",
        ]
    };
    const sign_boss = {
        type: EnemyType.INFO,
        info: [
            "This is this level's boss",
            "Your light attacks will not hurt him",
            "Try improve your weapon or use heavy attacks",
            "If you defeat it, the map is cleared."
        ]
    };
    const enemy_pack_1 = [
        { type: EnemyType.GOBLIN, count: 1 },
    ];
    const enemy_pack_2 = [
        { type: EnemyType.GOBLIN, count: 4 },
    ];
    const enemy_pack_4 = [
        { type: EnemyType.GOBLIN, count: 6 },
    ];
    const enemy_boss = [
        { type: EnemyType.HOB_GOBLIN, count: 1 },
        { type: EnemyType.GOBLIN, count: 2 },
        ...[...new Array(5)].map((_, index) => Object.assign({ position: new Vector2D(575, 150 + index * 80), }, sign_boss)),
    ];
    const village_enemies = [
        sign_main_attack,
        sign_heavy_attack,
    ];
    return {
        size: new Vector2D(4, 4),
        start: new Vector2D(1, 1),
        areas: [
            { type: WorldMapAreaType.GRAS, open_borders: S | E, entities: [...enemy_pack_1, sign_achievements] },
            { type: WorldMapAreaType.GRAS, open_borders: W | E, entities: enemy_pack_2 },
            { type: WorldMapAreaType.GRAS, open_borders: W | E, entities: [...enemy_pack_2, sign_achievement_hint_1] },
            { type: WorldMapAreaType.GRAS, open_borders: W, entities: enemy_pack_4 },
            //
            { type: WorldMapAreaType.GRAS, open_borders: N | S | E, entities: [...enemy_pack_1, sign_goblin] },
            { type: WorldMapAreaType.VILLAGE, open_borders: W | E, entities: village_enemies, x: 1, y: 1, }, // start
            { type: WorldMapAreaType.GRAS, open_borders: W | E, entities: enemy_pack_2 },
            { type: WorldMapAreaType.DUNGEON, open_borders: W | S, entities: enemy_pack_2 },
            //
            { type: WorldMapAreaType.GRAS, open_borders: N | S, entities: enemy_pack_1 },
            { type: WorldMapAreaType.DUNGEON, open_borders: E, entities: enemy_boss, boss: true },
            { type: WorldMapAreaType.DUNGEON, open_borders: W | E, entities: enemy_pack_2 },
            { type: WorldMapAreaType.DUNGEON, open_borders: N | W, entities: enemy_pack_2 },
            //
            { type: WorldMapAreaType.GRAS, open_borders: N | E, entities: [...enemy_pack_1, sign_tombstone] },
            { type: WorldMapAreaType.GRAS, open_borders: W | E, entities: enemy_pack_2 },
            { type: WorldMapAreaType.GRAS, open_borders: W | E, entities: [...enemy_pack_2, sign_achievement_hint_2] },
            { type: WorldMapAreaType.GRAS, open_borders: W, entities: enemy_pack_4 },
        ]
    }
}
