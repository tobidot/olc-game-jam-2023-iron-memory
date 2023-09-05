import { GameModel } from "../models/GameModel";
import { ViewSettings } from "../../library/abstract/mvc/View";
import { WorldMapArea } from "../models/WorldMap";
import { Rect } from "../../library/math/Rect";
import { Vector2D } from "../../library/math";
import { Assets } from "../base/Assets";
import { WorldMapAreaType } from "../consts/WorldMapAreaType";
import { WorldMapAreaBorder } from "../consts/Direction";
import { AiAgent } from "../models/AiAgent";
import { Potion } from "../models/Potion";

export class MapView {
    public precalculated_attributes = {
        map_screen_width: 0,
        map_screen_height: 0,
        used_screen_width: 0,
        used_screen_height: 0,
        tile_width: 0,
        tile_height: 0,
        screen_offset: new Vector2D(0, 0),
    };

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
        this.preCalculateSizeAttributes(model);
        this.renderBackground(model);
        this.context.lineWidth = Math.max(2, Math.floor(40 / Math.max(model.world_map.size.x, model.world_map.size.y)));
        for (let x = 0; x < model.world_map.size.x; x++) {
            for (let y = 0; y < model.world_map.size.y; y++) {
                this.renderTile(model, x, y, model.world_map.at(x, y));
            }
        }
    }

    /**
     * Render the background of the map
     * @param model 
     */
    public renderBackground(model: GameModel) {
        this.context.strokeStyle = "#880";
        this.context.lineWidth = (8);
        const { screen_offset, used_screen_width, used_screen_height } = this.precalculated_attributes;
        this.context.strokeRect(
            screen_offset.x - 4, screen_offset.y - 4,
            used_screen_width + 8,
            used_screen_height + 8,
        );
    }

    /**
     * Predeterine the size and scalings for the area fields
     * @param model 
     */
    public preCalculateSizeAttributes(
        model: GameModel
    ) {
        const map_screen_width = model.screen_resolution.x * 0.9;
        const map_screen_height = (model.screen_resolution.y - 100) * 0.9;
        const ratio = map_screen_width / map_screen_height;
        const tile_width = Math.min(map_screen_width / model.world_map.size.x, map_screen_height / model.world_map.size.y);
        const tile_height = Math.min(map_screen_height / model.world_map.size.y, map_screen_width / model.world_map.size.x);
        const used_screen_width = model.world_map.size.x * tile_width;
        const used_screen_height = model.world_map.size.y * tile_height;
        const screen_offset = model.screen_resolution.cpy()
            .mul(0.5)
            .add(new Vector2D(0, 30))
            .sub(new Vector2D((used_screen_width / 2), (used_screen_height / 2),));
        this.precalculated_attributes = {
            map_screen_width,
            map_screen_height,
            used_screen_width,
            used_screen_height,
            tile_width,
            tile_height,
            screen_offset,
        };
    }

    /**
     * Render a single tile
     * @param model 
     * @param x 
     * @param y 
     * @param tile 
     */
    public renderTile(model: GameModel, x: number, y: number, tile: WorldMapArea): void {
        if (!tile.discovered) {
            return;
        }
        const rect = this.determineScreenRectForTile(model, x, y);
        this.renderImage(model, rect, tile);
        this.renderPath(model, rect, tile)
        const alive_count = tile.entities.filter(e => e instanceof AiAgent && !e.is_dead).length;
        const potion_count = tile.entities.filter(e => e instanceof Potion  && !e.is_dead).length;
        if (tile.boss && alive_count > 0) {
            this.renderBoss(model, rect, tile);
        } else if (potion_count > 0) {
            this.renderPotion(model, rect, tile);
        }
        if (model.world_map.active_area_coordinate.x === x && model.world_map.active_area_coordinate.y === y) {
            this.renderSelectionHighlight(model, rect);
        }
    }


    /**
     * Calculate the screen rect for a tile 
     * @param model 
     * @param x 
     * @param y 
     */
    public determineScreenRectForTile(model: GameModel, x: number, y: number): Rect {
        // keeping a little space for the menu and a border
        const { tile_width, tile_height, screen_offset } = this.precalculated_attributes;
        const top_left = new Vector2D(
            x * tile_width,
            y * tile_height,
        ).add(screen_offset);
        return Rect.fromLeftTopWidthHeight(
            top_left.x,
            top_left.y,
            Math.ceil(tile_width),
            Math.ceil(tile_height)
        );
    }

    /**
     * Indicate that this is a boss area
     * @param model 
     * @param rect 
     * @param tile 
     */
    public renderBoss(model: GameModel, rect: Rect, tile: WorldMapArea) {
        const image_name = Assets.images.world_map.boss;
        const image_asset = model.game.assets.getImage(image_name);
        this.context.drawImage(image_asset.image, rect.left, rect.top, rect.width, rect.height);
    }

    /**
     * Indicate that this is a boss area
     * @param model 
     * @param rect 
     * @param tile 
     */
    public renderPotion(model: GameModel, rect: Rect, tile: WorldMapArea) {
        const image_name = Assets.images.area.potion;
        const image_asset = model.game.assets.getImage(image_name);
        const minor_rect = rect.cpy();
        minor_rect.size.mul(0.5);
        this.context.drawImage(image_asset.image, minor_rect.left, minor_rect.top, minor_rect.width, minor_rect.height);
    }

    /**
     * Draws the lines which can be traveled over this tile.
     * 
     * @param model 
     * @param rect 
     * @param tile 
     */
    public renderPath(model: GameModel, rect: Rect, tile: WorldMapArea): void {
        const center = rect.center;
        const offsets = {
            [WorldMapAreaBorder.NORTH]: new Vector2D(center.x, rect.top),
            [WorldMapAreaBorder.SOUTH]: new Vector2D(center.x, rect.bottom),
            [WorldMapAreaBorder.WEST]: new Vector2D(rect.left, center.y),
            [WorldMapAreaBorder.EAST]: new Vector2D(rect.right, center.y),
        };
        this.context.strokeStyle = "#000";
        this.context.beginPath();
        tile.open_borders.forEach((value, key) => {
            if (!value) {
                return;
            }
            const offset = offsets[key];
            this.context.moveTo(center.x, center.y);
            this.context.lineTo(offset.x, offset.y);
        });
        this.context.stroke();
    }

    /**
     * Render the main image for the tile
     * @param model 
     * @param tile 
     * @param rect 
     */
    public renderImage(model: GameModel, rect: Rect, tile: WorldMapArea,): void {
        const image_name = {
            [WorldMapAreaType.DUNGEON]: Assets.images.world_map.dungeon,
            [WorldMapAreaType.FORREST]: Assets.images.world_map.forrest,
            [WorldMapAreaType.GRAS]: Assets.images.world_map.gras,
            [WorldMapAreaType.MOUNTAIN]: Assets.images.world_map.mountain,
            [WorldMapAreaType.VILLAGE]: Assets.images.world_map.village,
        }[tile.type];
        const image_asset = model.game.assets.getImage(image_name);
        this.context.drawImage(image_asset.image, rect.left, rect.top, rect.width, rect.height);
    }

    /**
     * Render the indicator for the 
     * @param rect 
     */
    public renderSelectionHighlight(model: GameModel, rect: Rect): void {
        this.context.save();
        this.context.strokeStyle = "#000";
        this.context.setLineDash([2, 2]);
        // rotate 2 pixel every second
        this.context.lineDashOffset = performance.now() * 2 / 1000;
        this.context.lineWidth = 2;
        this.context.strokeRect(rect.left + 1, rect.top + 1, rect.width - 2, rect.height - 2);
        this.context.fillStyle = "#fff";
        this.context.globalAlpha = (Math.sin(performance.now() / 250)+ 1) / 2;
        this.context.fillRect(rect.left + 1, rect.top + 1, rect.width - 2, rect.height - 2);
        this.context.restore();
    }
}