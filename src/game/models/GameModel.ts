import * as tgt from "../../library/index";
import { MenuButtonModel, MenuGroupModel, MenuModel, assert } from "../../library/index";
import { Vector2D } from "../../library/math";
import { Game } from "../base/Game";
import { MenuButtonName } from "../consts/MenuButtonName";
import { ViewName } from "../consts/ViewName";
import { HeroUnitFactory } from "../factories/HeroUnitFactory";
import { WalkableArea } from "./WalkableArea";

export class GameModel implements tgt.Model {
    public active_view: ViewName = ViewName.MAIN_MENU;
    // 
    public buttons: Array<MenuButtonModel> = [];
    //
    public walkable_area = new WalkableArea();
    // factories
    public hero_factory: HeroUnitFactory;

    public constructor(
        protected readonly game: Game,
        context: CanvasRenderingContext2D,
    ) {
        this.buttons = this.createMenu(context);
        this.hero_factory = new HeroUnitFactory(this.game);
    }

    public createMenu(
        context: CanvasRenderingContext2D,
    ): Array<MenuButtonModel> {
        const globals = new tgt.MenuGlobals(context);
        globals.asset_manager = this.game.assets;
        globals.audio_player = this.game.audio;
        globals.primary_color = "#fff";
        globals.background_color = "#000";
        const settings = {
        };
        const button_generator = new tgt.MenuGenerator(globals, settings)
            .set("width", 180)
            .set("height", 20)
            .set("callback", (button: MenuButtonModel) => {
                button.onSelect(() => this.game.controller.onMenuSelect(button));
            })
            .button()
            ;

        const top_menu = [
            button_generator.set("x", 10).set("y", 5).make(MenuButtonName.INVENTORY, "Inventory"),
            button_generator.set("x", 210).set("y", 5).make(MenuButtonName.ACHIEVEMENTS, "Achievements"),
            button_generator.set("x", 610).set("y", 5).set('width', 140).make(MenuButtonName.MAIN_MENU, "Menu"),
            button_generator.set("x", 770).set("y", 5).set('width', 20).make(MenuButtonName.GAME, "X"),
        ];
        // main menu
        button_generator.set("width", 180)
        const main_menu = [
            button_generator.set("x", 300).set("y", 135).make(MenuButtonName.NEW_GAME, "New Game"),
            button_generator.set("x", 300).set("y", 165).make(MenuButtonName.TOGGLE_MUSIC, "Toggle Music"),
            button_generator.set("x", 300).set("y", 195).make(MenuButtonName.TOGGLE_SOUND, "Toggle Sound"),
        ];
        // sub menus not visible by default
        button_generator.set("visible", false);

        return [
            ...top_menu,
            ...main_menu,
        ];
    }

    public reset() {
        this.walkable_area.clear();
        this.walkable_area.addEntity(this.hero_factory.makeSwordsman(new Vector2D(400,300)));
    }

    public update(delta_seconds: number): void {

    }
}