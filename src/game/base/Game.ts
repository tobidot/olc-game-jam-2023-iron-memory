import { GameController } from "../controllers/GameController";
import { GameModel } from "../models/GameModel";
import { GameView } from "../views/GameView";
import * as tgt from "../../library/index";
import { registerAssets } from "./Assets";
import { ViewName } from "../consts/ViewName";
import { AreaController } from "../controllers/AreaController";
import { WorldMapAreaBorder } from "../consts/Direction";

export class Game extends tgt.GameTemplate<
    GameModel,
    GameView,
    GameController
> {
    // Controllers
    protected area_controller!: AreaController;
    //
    public on_game_finished: null | (() => void) = null;

    public constructor(app: HTMLElement) {
        super(app);

    }

    protected getKeyboardController(): tgt.KeyboardController {
        switch (this.model.active_view) {
            case ViewName.AREA:
                return this.area_controller;
            case ViewName.ACHIEVEMENTS:
                return this.area_controller;
            case ViewName.INVENTORY:
                return this.area_controller;
            case ViewName.MAIN_MENU:
                return this.area_controller;
            case ViewName.WORLD_MAP:
                return this.area_controller;
            default:
                throw new Error("Unknown view: " + this.model.active_view);
        }
    }

    protected getMouseController(): tgt.MouseController {
        switch (this.model.active_view) {
            case ViewName.AREA:
                return this.area_controller;
            case ViewName.ACHIEVEMENTS:
                return this.area_controller;
            case ViewName.INVENTORY:
                return this.area_controller;
            case ViewName.MAIN_MENU:
                return this.area_controller;
            case ViewName.WORLD_MAP:
                return this.area_controller;
            default:
                throw new Error("Unknown view: " + this.model.active_view);
        }
    }

    /**
     * Create the Initial Model View and Controller
     * @param context 
     * @returns 
     */
    protected initMvc(context: CanvasRenderingContext2D): this {
        this.view = new GameView(context);
        this.model = new GameModel(this, context);
        this.controller = new GameController(this);
        this.area_controller = new AreaController(this);
        return this;
    }

    /**
     * Register the required Assets
     * @param assets 
     */
    protected registerAssets(assets: tgt.AssetManager): void {
        registerAssets(assets);
    }

    /**
     * Prepare for a new Game
     * @param resolve 
     * @param reject 
     */
    protected newGame(
        resolve: () => void,
        reject: (reason?: any) => void
    ): void {
        this.model.reset();
        const starting_area = this.model.world_map.at(
            this.model.world_map.active_area_coordinate.x,
            this.model.world_map.active_area_coordinate.y
        );
        this.controller.travelTo(starting_area);
    }
}