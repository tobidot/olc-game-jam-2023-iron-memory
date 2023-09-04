import { AssetManager } from "../../library";
// area
import player from "../../../assets/images/area/warrior.png";
import obstacle from "../../../assets/images/area/obstacle.png";
import slash from "../../../assets/images/area/slash.png";
import sword from "../../../assets/images/area/sword.png";
import imp from "../../../assets/images/area/imp.png";
import enemy from "../../../assets/images/area/enemy.png";
import goblin from "../../../assets/images/area/goblin.png";
import spider from "../../../assets/images/area/spider.png";
import hob_goblin from "../../../assets/images/area/hob_goblin.png";
import orc from "../../../assets/images/area/orc.png";
import troll from "../../../assets/images/area/troll.png";
import demon from "../../../assets/images/area/demon.png";
import lich from "../../../assets/images/area/lich.png";
import dragon from "../../../assets/images/area/dragon.png";
//
import village_obstacle from "../../../assets/images/area/village_obstacle.png";
import forrest_obstacle from "../../../assets/images/area/forrest_obstacle.png";
import mountain_obstacle from "../../../assets/images/area/mountain_obstacle.png";
import dungeon_obstacle from "../../../assets/images/area/dungeon_obstacle.png";
import gras_obstacle from "../../../assets/images/area/gras_obstacle.png";
// 
import village_background from "../../../assets/images/area/village_background.png";
import forrest_background from "../../../assets/images/area/forrest_background.png";
import mountain_background from "../../../assets/images/area/mountain_background.png";
import dungeon_background from "../../../assets/images/area/dungeon_background.png";
import gras_background from "../../../assets/images/area/gras_background.png";
// 
import hit_me from "../../../assets/images/area/info_hit_me.png";
// world_map
import dungeon from "../../../assets/images/world_map/dungeon.png";
import forrest from "../../../assets/images/world_map/forrest.png";
import gras from "../../../assets/images/world_map/gras.png"; 
import mountain from "../../../assets/images/world_map/mountain.png";
import village from "../../../assets/images/world_map/village.png";
import boss from "../../../assets/images/world_map/boss.png";
 
export const Assets = {
    images: {
        background: {
            village_background,
            forrest_background,
            mountain_background,
            dungeon_background,
            gras_background,
        },
        info: {
            hit_me,
        },
        area: {
            player,
            obstacle, 
            enemy,
            slash,
            sword,
            forrest_obstacle,
            mountain_obstacle,
            dungeon_obstacle,
            gras_obstacle,
            village_obstacle,
            imp,
            goblin,
            spider,
            hob_goblin,
            orc,
            troll,
            demon,
            lich,
            dragon,            
        },
        world_map: {
            dungeon,
            mountain,
            forrest,
            gras,
            village,
            boss,
        },
    },
    sounds: {
    },
    musics: {
    }
};

export function registerAssets(asset_manager: AssetManager) {
    // Register images
    forEveryString(Assets.images, (key, value) => {
        asset_manager.addImage(value, value);
    });
    forEveryString(Assets.sounds, (key, value) => {
        asset_manager.addSound(value, value);
    });
    forEveryString(Assets.musics, (key, value) => {
        asset_manager.addMusic(value, value);
    });
}

type StringMap = { [key: string]: string | string[] | StringMap };

function forEveryString(object: StringMap|Array<string>, callback: (key: string, value: string) => void) {
    for (let key in object) {
        let value = object[key];
        if (typeof value === "string") {
            callback(key, value);
            continue;
        }
        forEveryString(value, callback);
    }
}