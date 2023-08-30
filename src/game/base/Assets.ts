import { AssetManager } from "../../library";

export const Assets = {
    images: {
    },
    sounds: {
    },
    musics: {
    }
};

export function registerAssets(asset_manager: AssetManager) {
    // Register images
    for( let key in Assets.images) {
        asset_manager.addImage(Assets.images[key], Assets.images[key]);
    };
    for( let key in Assets.sounds) {
        asset_manager.addSound(Assets.sounds[key], Assets.sounds[key]);
    };
    for( let key in Assets.musics) {
        asset_manager.addMusic(Assets.musics[key], Assets.musics[key]);
    };
}