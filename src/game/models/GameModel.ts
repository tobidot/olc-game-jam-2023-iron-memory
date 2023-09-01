import * as tgt from "../../library/index";
import { MenuButtonModel, MenuGroupModel, MenuModel, assert } from "../../library/index";
import { Game } from "../base/Game";
import { MenuButtonName } from "../consts/MenuButtonName";

export class GameModel implements tgt.Model {
    public buttons: Array<MenuButtonModel> = [];
    //

    public constructor(
        protected readonly game: Game,
        context: CanvasRenderingContext2D,
    ) {
        this.buttons = this.createMenu(context);
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
            // button_generator.set("x", 410).set("y", 5).make(MenuButtonName.INVENTORY, "[E] Upgrade Towerspeed (" + 0 + " Gold)"),
            button_generator.set("x", 610).set("y", 5).make(MenuButtonName.MENU, "Menu"),
        ];
        // sub menus not visible by default
        button_generator.set("visible", false);
        const main_menu = [
            button_generator.set("x", 300).set("y", 135).make(MenuButtonName.NEW_GAME, "New Game"),
            button_generator.set("x", 300).set("y", 165).make(MenuButtonName.TOGGLE_MUSIC, "Toggle Music"),
            button_generator.set("x", 300).set("y", 195).make(MenuButtonName.TOGGLE_SOUND, "Toggle Sound"),
        ];

        return [
            ...top_menu,
            ...main_menu,
        ];
    }

    public update(delta_seconds: number): void {

    }
}