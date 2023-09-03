import * as tgt from "../../library/index";
import { MenuButtonModel, MenuGroupModel, MenuModel, assert } from "../../library/index";
import { Vector2D } from "../../library/math";
import { Game } from "../base/Game";
import { MenuButtonName } from "../consts/MenuButtonName";
import { ViewName } from "../consts/ViewName";
import { CreepUnitFactory } from "../factories/CreepUnitFactory";
import { EffectFactory } from "../factories/EffectFactory";
import { HeroUnitFactory } from "../factories/HeroUnitFactory";
import { WalkableArea } from "./WalkableArea";
import { WorldMap } from "./WorldMap";

export class GameModel implements tgt.Model {
    public active_view: ViewName = ViewName.MAIN_MENU;
    public screen_resolution: Vector2D = new Vector2D(800, 600);
    // 
    public buttons: Array<MenuButtonModel> = [];
    //
    public walkable_area = new WalkableArea();
    public world_map = new WorldMap();
    // factories
    public hero_factory: HeroUnitFactory;
    public creep_factory: CreepUnitFactory;
    public effect_factory: EffectFactory;

    public constructor(
        public readonly game: Game,
        context: CanvasRenderingContext2D,
    ) {
        this.buttons = this.createMenu(context);
        this.hero_factory = new HeroUnitFactory(this.game);
        this.creep_factory = new CreepUnitFactory(this.game);
        this.effect_factory = new EffectFactory(this.game);
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
            button_generator.set("x", 410).set("y", 5).make(MenuButtonName.WORLD_MAP, "World Map"),
            button_generator.set("x", 610).set("y", 5).set('width', 140).make(MenuButtonName.MAIN_MENU, "Menu"),
            button_generator.set("x", 770).set("y", 5).set('width', 20).make(MenuButtonName.GAME, "X"),
        ];
        // main menu
        button_generator.set("width", 200)
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
        this.walkable_area.hero = this.walkable_area.addEntity(this.hero_factory.makeSwordsman(new Vector2D(400,300)));
        for(let i=0;i< 12;++i) {
            this.walkable_area.addEntity(this.creep_factory.makeGoblin(new Vector2D(Math.random()* 800,Math.random() * 600)));
        }
        this.world_map.generateWorld();
    }

    public update(delta_seconds: number): void {        
        this.game.model.buttons.forEach((button) => {
            button.update(delta_seconds, this.game.mouse);
        });
        this.walkable_area.update(delta_seconds);
    }
}