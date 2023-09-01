import { GameBaseController, MenuModel, MouseUpEvent } from "../../library";
import { Controller } from "../../library/abstract/mvc/Controller";
import { ControllerResponse } from "../../library/abstract/mvc/Response";
import { Game } from "../base/Game";
import { MenuButtonName, main_menu_button_names, top_menu_button_names } from "../consts/MenuButtonName";
import { ViewName } from "../consts/ViewName";

export class GameController implements Controller {

    public constructor(
        protected readonly game: Game,
    ) {

    }

    /**
     * Start a new game
     */
    public newGame(): ControllerResponse {

        return null;
    }

    public isGameOver(): boolean {
        return false;
    }

    public update(delta_seconds: number): ControllerResponse {
        this.game.model.update(delta_seconds);
        this.game.model.buttons.forEach((button) => {
            button.update(delta_seconds, this.game.mouse);
        });
        return null;
    }

    public onMouseUp(event: MouseUpEvent): void {
        this.game.model.buttons.forEach((button) => {
            if (button.is_visible && button.area.contains(this.game.mouse.position)) {
                button.select();
                return true;
            }
        });
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
            case MenuButtonName.MAIN_MENU: this.switchView(ViewName.MAIN_MENU); break;
            case MenuButtonName.GAME: this.switchView(ViewName.GAME); break;
            // main menu
        }
    }

    /**
     * Change view to the given view
     * @param name 
     */
    public switchView(name: ViewName) {
        this.game.model.active_view = name;
        this.hideSubViewButtons();
        switch (name) {
            case ViewName.ACHIEVEMENTS:
                this.showAchievementsButtons();
                break;
            case ViewName.INVENTORY:
                this.showInventoryButtons();
                break;
            case ViewName.MAIN_MENU:
                this.showMainMenuButtons();
                break;
            case ViewName.GAME:
                break;
        }
    }

    /**
     * 
     */
    public hideSubViewButtons() {
        const active = top_menu_button_names;
        this.game.model.buttons.forEach((button) => {
            button.is_visible = active.includes(button.name as MenuButtonName);
        });
    }

    public showMainMenuButtons() {
        const activate = main_menu_button_names;
        this.game.model.buttons.forEach((button) => {
            if (activate.includes(button.name as MenuButtonName)) {
                button.is_visible = true;
            }
        });
    }

    public showAchievementsButtons() {
        const activate: Array<string> = [];
        this.game.model.buttons.forEach((button) => {
            if (activate.includes(button.name as MenuButtonName)) {
                button.is_visible = true;
            }
        });
    }

    public showInventoryButtons() {
        const activate: Array<string> = [];
        this.game.model.buttons.forEach((button) => {
            if (activate.includes(button.name as MenuButtonName)) {
                button.is_visible = true;
            }
        });
    }
}