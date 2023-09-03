import { KeyName, KeyUpEvent, MenuModel, MouseUpEvent, assert } from "../../library";
import { ControllerResponse } from "../../library/abstract/mvc/Response";
import { Game } from "../base/Game";
import { WorldMapAreaBorder } from "../consts/Direction";
import { MenuButtonName } from "../consts/MenuButtonName";
import { ViewName } from "../consts/ViewName";
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
        this.game.model.world_map.travel(border);
        const walkable_area = this.game.model.walkable_area;
        walkable_area.clear();
        walkable_area.addEntity(walkable_area.hero = player);
    }
}