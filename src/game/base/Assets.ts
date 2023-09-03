import { AssetManager } from "../../library";
// area
import player from "../../../assets/images/area/player.png";
import obstacle from "../../../assets/images/area/obstacle.png";
import enemy from "../../../assets/images/area/enemy.png";
import slash from "../../../assets/images/area/slash.png";
// world_map
import dungeon from "../../../assets/images/world_map/dungeon.png";
import forrest from "../../../assets/images/world_map/forrest.png";
import gras from "../../../assets/images/world_map/gras.png";
import mountain from "../../../assets/images/world_map/mountain.png";
import village from "../../../assets/images/world_map/village.png";

export const Assets = {
    images: {
        area: {
            player,
            obstacle,
            enemy,
            slash,
        },
        world_map: {
            dungeon,
            mountain,
            forrest,
            gras,
            village,
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