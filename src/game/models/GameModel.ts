import * as tgt from "../../library/index";
import { MenuButtonModel, MenuGroupModel, MenuModel, assert } from "../../library/index";
import { Game } from "../base/Game";

export class GameModel implements tgt.Model {
    public menu: MenuGroupModel;
    public buttons: Array<MenuButtonModel> = [];
    //

    public constructor(
        protected readonly game: Game,
        context: CanvasRenderingContext2D,
    ) {
        this.menu = this.createMenu(context);
    }

    public createMenu(
        context: CanvasRenderingContext2D,
    ): tgt.MenuGroupModel {
        const globals = new tgt.MenuGlobals(context);
        globals.asset_manager = this.game.assets;
        globals.audio_player = this.game.audio;
        globals.primary_color = "#fff";
        globals.background_color = "#000";
        const settings = {
        };
        const generator = new tgt.MenuGenerator(globals, settings)
            .set("x", 10)
            .set("y", 10)
            ;
        const menu_definition: tgt.MenuDefinitionGroup = {
            name: "game_menu",
            label: "Game Menu",
            width: 250,            

            children: [                
                {
                    width: 250,
                    name: "new_game",
                    label: "New Game",
                },
                {
                    name: "toggle_sound",
                    label: "Toggle Sound",
                },
            ]
        };
        const menu = generator.compile(menu_definition);
        menu.refresh();
        assert(menu instanceof MenuGroupModel);
        menu.onSelect((item: MenuModel) => {
            this.game.controller.onMenuSelect(item);
        });

        const button_generator = new tgt.MenuGenerator(globals, settings)
            .set("width", 380)
            .set("height", 25)
            .set("callback", (button: MenuButtonModel) => {
                button.onSelect(() => this.game.controller.onMenuSelect(button));
            })
            .button()
            ;

        this.buttons = [
            button_generator.set("x", 10).set("y", 525).make("buy_worker", "[Q] Buy Worker (" + 0 + " Gold)"),
            button_generator.set("x", 10).set("y", 560).make("buy_swordsman", "[W] Buy Swordsman (" + 0 + " Gold)"),
            button_generator.set("x", 410).set("y", 525).make("upgrade_tower_speed", "[E] Upgrade Towerspeed (" + 0 + " Gold)"),
            button_generator.set("x", 410).set("y", 560).make("upgrade_tower_damage", "[R] Upgrade Towerdamage (" + 0 + " Gold)"),
        ];
        return menu;
    }

    public update(delta_seconds: number): void {

    }
}