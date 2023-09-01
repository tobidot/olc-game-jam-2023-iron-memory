import { GameBaseController, MenuModel, MouseUpEvent } from "../../library";
import { Controller } from "../../library/abstract/mvc/Controller";
import { ControllerResponse } from "../../library/abstract/mvc/Response";
import { Game } from "../base/Game";
import { MenuButtonName, main_menu_button_names, top_menu_button_names } from "../consts/MenuButtonName";

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
            case MenuButtonName.ACHIEVEMENTS:
            case MenuButtonName.INVENTORY:
                this.hideAllMenus();
                break;
            case MenuButtonName.MENU:
                this.hideAllMenus();
                this.showMainMenu();
                break;
        }
    }

    public hideAllMenus() {
        const active = top_menu_button_names;
        this.game.model.buttons.forEach((button) => {
            button.is_visible = active.includes(button.name as MenuButtonName);
        });
    }

    public showMainMenu() {
        const activate = main_menu_button_names;
        this.game.model.buttons.forEach((button) => {
            if (activate.includes(button.name as MenuButtonName)) {
                button.is_visible = true;
            }
        });
    }
}