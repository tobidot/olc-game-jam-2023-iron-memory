import { GameModel } from "../models/GameModel";
import { ViewSettings } from "../../library/abstract/mvc/View";
import { WorldMapArea } from "../models/WorldMap";
import { Rect } from "../../library/math/Rect";
import { Vector2D } from "../../library/math";
import { Assets } from "../base/Assets";
import { WorldMapAreaType } from "../consts/WorldMapAreaType";

export class MapView {

    public constructor(
        public context: CanvasRenderingContext2D,
        public settings: ViewSettings,
    ) {
    }

    public update(delta_ms: number): void {
        // do nothing
    }

    /**
     * Render the complete game state
     * @param model 
     */
    public render(model: GameModel): void {
        for (let x = 0; x < model.world_map.size.x; x++) {
            for (let y = 0; y < model.world_map.size.y; y++) {
                this.renderTile(model, x, y, model.world_map.at(x, y));
            }
        }
    }

    /**
     * Render a single tile
     * @param model 
     * @param x 
     * @param y 
     * @param tile 
     */
    public renderTile(model: GameModel, x: number, y: number, tile: WorldMapArea): void {
        // keeping a little space for the menu and a border
        const map_screen_width = model.screen_resolution.x * 0.9;
        const map_screen_height = (model.screen_resolution.y - 100) * 0.9;
        const tile_width = map_screen_width / model.world_map.size.x;
        const tile_height = map_screen_height / model.world_map.size.y;
        const top_left = new Vector2D(
            x * tile_width + model.screen_resolution.x * 0.05,
            y * tile_height + (model.screen_resolution.y - 100) * 0.05 + 50,
        );
        const rect = Rect.fromLeftTopWidthHeight(
            top_left.x,
            top_left.y,
            Math.ceil(tile_width),
            Math.ceil(tile_height)
        );
        const image_name = {
            [WorldMapAreaType.DUNGEON]: Assets.images.world_map.dungeon,
            [WorldMapAreaType.FORREST]: Assets.images.world_map.forrest,
            [WorldMapAreaType.GRAS]: Assets.images.world_map.gras,
            [WorldMapAreaType.MOUNTAIN]: Assets.images.world_map.mountain,
            [WorldMapAreaType.VILLAGE]: Assets.images.world_map.village,
        }[tile.type];
        const image_asset = model.game.assets.getImage(image_name);
        this.context.drawImage(image_asset.image, rect.left, rect.top, rect.width, rect.height);

        if (model.world_map.active_area_coordinate.x === x && model.world_map.active_area_coordinate.y === y) {
            this.context.save();
            this.context.strokeStyle = "#000";
            this.context.setLineDash([2, 2]);
            // rotate 2 pixel every second
            this.context.lineDashOffset = performance.now() * 2 / 1000;
            this.context.lineWidth = 2;
            this.context.strokeRect(rect.left+1, rect.top+1, rect.width-2, rect.height-2);
            this.context.restore();
        }
    }
}