import { KeyName, KeyUpEvent, MenuModel, MouseUpEvent, assert } from "../../library";
import { ControllerResponse } from "../../library/abstract/mvc/Response";
import { Vector2D } from "../../library/math";
import { Game } from "../base/Game";
import { WorldMapAreaBorder } from "../consts/Direction";
import { MenuButtonName } from "../consts/MenuButtonName";
import { ViewName } from "../consts/ViewName";
import { Agent } from "../models/Agent";
import { WorldMapArea } from "../models/WorldMap";
import { BaseController } from "./BaseController";

export class GameController extends BaseController {

    public constructor(
        game: Game,
    ) {
        super(game);
    }

    /**
     * Start a new game
     */
    public newGame(): ControllerResponse {
        this.game.model.reset();
        const starting_area = this.game.model.world_map.at(
            this.game.model.world_map.active_area_coordinate.x,
            this.game.model.world_map.active_area_coordinate.y
        );
        this.travelTo(starting_area, WorldMapAreaBorder.NORTH);
        return null;
    }

    public isGameOver(): boolean {
        return false;
    }

    public update(delta_seconds: number): ControllerResponse {
        this.game.model.update(delta_seconds);
        return null;
    }

    /**
     * Any button has been clicked
     * @param item 
     */
    public onMenuSelect(item: MenuModel): void {
        console.log("Menu item selected: " + item.name);
        switch (item.name) {
            // top menu bar
            case MenuButtonName.ACHIEVEMENTS: this.switchView(ViewName.ACHIEVEMENTS); break;
            case MenuButtonName.INVENTORY: this.switchView(ViewName.INVENTORY); break;
            case MenuButtonName.WORLD_MAP: this.switchView(ViewName.WORLD_MAP); break;
            case MenuButtonName.MAIN_MENU: this.switchView(ViewName.MAIN_MENU); break;
            case MenuButtonName.GAME: this.switchView(ViewName.AREA); break;
            case MenuButtonName.NEW_GAME: this.newGame(); break;
            default: console.log("Unknown menu item selected: " + item.name); break;
        }
    }

    /**
     * Pass to another area in the map
     * @param border 
     */
    public travel(border: WorldMapAreaBorder) {
        const player = this.game.model.walkable_area.hero;
        assert(!!player, "No player unit");
        // do nothing if border is closed
        const active_coordinates = this.game.model.world_map.active_area_coordinate;
        const old_area = this.game.model.world_map.at(
            active_coordinates.x,
            active_coordinates.y
        );
        const border_state = old_area.open_borders.get(border);
        if (border_state !== true) {
            // border is closed
            return;
        }
        // travel to next area        
        const next_area_position = this.game.model.world_map.getBorderPosition(active_coordinates, border);
        const new_area = this.game.model.world_map.at(next_area_position.x, next_area_position.y);
        this.travelTo(new_area, {
            [WorldMapAreaBorder.EAST]: WorldMapAreaBorder.WEST,
            [WorldMapAreaBorder.WEST]: WorldMapAreaBorder.EAST,
            [WorldMapAreaBorder.NORTH]: WorldMapAreaBorder.SOUTH,
            [WorldMapAreaBorder.SOUTH]: WorldMapAreaBorder.NORTH,
        }[border]);
    }

    public travelTo(
        new_area: WorldMapArea,
        from: WorldMapAreaBorder,
    ) {
        const player = this.game.model.walkable_area.hero;
        assert(!!player, "No player unit");
        // reset the walkable area
        const walkable_area = this.game.model.walkable_area;
        // reset the player position to the opposie border of where he just traveld to
        const offset = this.game.model.world_map.getBorderOffset(from);
        const player_box = player.physics.shape.getOuterBox();
        const new_position = new Vector2D(
            offset.x * (walkable_area.area.size.x / 2 - player_box.width - 10) + walkable_area.area.center.x,
            offset.y * (walkable_area.area.size.y / 2 - player_box.height - 10) + walkable_area.area.center.y,
        );
        player.physics.shape.setCenter(new_position);

        // reset the walkable area
        walkable_area.clear();
        walkable_area.addEntity(walkable_area.hero = player);
        new_area.entities.forEach((entity) => {
            if (entity instanceof Agent && entity.is_dead) {
                return;
            }
            walkable_area.addEntity(entity);
        });
        console.log(new_area, walkable_area);
    }

}