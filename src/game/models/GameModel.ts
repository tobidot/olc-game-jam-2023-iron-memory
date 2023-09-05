import * as tgt from "../../library/index";
import { MenuButtonModel, MenuGroupModel, MenuModel, assert } from "../../library/index";
import { Vector2D } from "../../library/math";
import { Game } from "../base/Game";
import { WorldMapAreaBorder } from "../consts/Direction";
import { MenuButtonName } from "../consts/MenuButtonName";
import { ViewName } from "../consts/ViewName";
import { CreepUnitFactory } from "../factories/CreepUnitFactory";
import { EffectFactory } from "../factories/EffectFactory";
import { HeroUnitFactory } from "../factories/HeroUnitFactory";
import { InfoFactory } from "../factories/InfoFactory";
import { ObstacleFactory } from "../factories/ObstacleFactory";
import { WeaponFactory } from "../factories/WeaponFactory";
import { WalkableArea } from "./WalkableArea";
import { WorldMap } from "./WorldMap";

export class GameModel implements tgt.Model {
    public active_view: ViewName = ViewName.MAIN_MENU;
    public screen_resolution: Vector2D = new Vector2D(800, 600);
    // 
    public buttons: Array<MenuButtonModel> = [];
    //
    public walkable_area = new WalkableArea();
    public world_map: WorldMap;
    // factories
    public hero_factory: HeroUnitFactory;
    public creep_factory: CreepUnitFactory;
    public effect_factory: EffectFactory;
    public obstacle_factory: ObstacleFactory;
    public weapon_factory: WeaponFactory;
    public info_factory: InfoFactory;
    // the size of the achievement screen
    public achievement_screen_height: number = 0;

    public constructor(
        public readonly game: Game,
        context: CanvasRenderingContext2D,
    ) {
        this.buttons = this.createMenu(context);
        this.world_map  = new WorldMap(this.game);
        this.hero_factory = new HeroUnitFactory(this.game);
        this.creep_factory = new CreepUnitFactory(this.game);
        this.effect_factory = new EffectFactory(this.game);
        this.obstacle_factory = new ObstacleFactory(this.game);
        this.weapon_factory = new WeaponFactory(this.game);
        this.info_factory = new InfoFactory(this.game);
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
            // button_generator.set("x", 10).set("y", 5).make(MenuButtonName.INVENTORY, "Inventory"),
            button_generator.set("x", 210).set("y", 5).make(MenuButtonName.ACHIEVEMENTS, "Achievements"),
            button_generator.set("x", 410).set("y", 5).make(MenuButtonName.WORLD_MAP, "World Map"),
            button_generator.set("x", 610).set("y", 5).set('width', 140).make(MenuButtonName.MAIN_MENU, "Menu"),
            button_generator.set("x", 770).set("y", 5).set('width', 20).make(MenuButtonName.GAME, "X"),
        ];
        // main menu
        button_generator.set("width", 200)
        const main_menu = [
            button_generator.set("x", 300).set("y", 125).make(MenuButtonName.LEVEL_TUTORIAL, "Tutorial"),
            button_generator.set("x", 300).set("y", 165).make(MenuButtonName.LEVEL_CAMPAIGN_1, "Level 1"),
            button_generator.set("x", 300).set("y", 195).make(MenuButtonName.LEVEL_CAMPAIGN_2, "Level 2"),
            button_generator.set("x", 300).set("y", 225).make(MenuButtonName.LEVEL_CAMPAIGN_3, "Level 3"),
            button_generator.set("x", 300).set("y", 255).make(MenuButtonName.LEVEL_CAMPAIGN_4, "Level 4"),
            button_generator.set("x", 300).set("y", 295).make(MenuButtonName.LEVEL_RANDOM_SMALL, "Small Random Level"),
            button_generator.set("x", 300).set("y", 325).make(MenuButtonName.LEVEL_RANDOM_MEDIUM, "Medium Random Level"),
            button_generator.set("x", 300).set("y", 355).make(MenuButtonName.LEVEL_RANDOM_BIG, "Large Random Level"),
            button_generator.set("x", 300).set("y", 385).make(MenuButtonName.LEVEL_RANDOM_BIG, "Big Random Level"),
            button_generator.set("x", 300).set("y", 415).make(MenuButtonName.LEVEL_RANDOM_HUGE, "Huge Random Level"),
            // button_generator.set("x", 300).set("y", 165).make(MenuButtonName.TOGGLE_MUSIC, "Toggle Music"),
            // button_generator.set("x", 300).set("y", 195).make(MenuButtonName.TOGGLE_SOUND, "Toggle Sound"),
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
    }

    public resetAfterDeath() {
        this.walkable_area.clear();
        this.walkable_area.hero = this.walkable_area.addEntity(this.hero_factory.makeSwordsman(new Vector2D(400,300)));
        this.world_map.repopulateWorld();
    }

    public update(delta_seconds: number): void {        
        this.game.model.buttons.forEach((button) => {
            button.update(delta_seconds, this.game.mouse);
        });
        this.walkable_area.update(delta_seconds);
    }
}