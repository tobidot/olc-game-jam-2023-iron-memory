import { KeyName, KeyUpEvent, KeyboardController, MouseController, MouseUpEvent } from "../../library";
import { Game } from "../base/Game";
import { MenuButtonName, main_menu_button_names, top_menu_button_names } from "../consts/MenuButtonName";
import { ViewName } from "../consts/ViewName";

export class BaseController implements KeyboardController, MouseController {
    public constructor(
        public game: Game
    ) {
    }

    public onMouseUp(event: MouseUpEvent): void {
        this.game.model.buttons.forEach((button) => {
            if (button.is_visible && button.area.contains(this.game.mouse.position)) {
                button.select();
                return true;
            }
        });
    }

    public onKeyUp(event: KeyUpEvent): void {
        const is_control_down = this.game.keyboard.getKey(KeyName.Control);
        switch (event.key.name) {
            case KeyName.Escape:
                this.switchView(ViewName.AREA);
                break;
            case KeyName.KeyM:
                this.switchView(ViewName.WORLD_MAP);
                break;
            case KeyName.KeyI:
            case KeyName.Tab:
                this.switchView(ViewName.ACHIEVEMENTS);
                break;
            case KeyName.KeyO:
                if (is_control_down) {
                    // cheat reveal map
                    this.game.model.world_map.areas.forEach((area) => { area.discovered = true; });
                }
                break;
        }
    }

    /**
     * Change view to the given view
     * @param name 
     */
    public switchView(name: ViewName): void {
        this.game.model.active_view = name;
        this.hideAllSubViewButtons();
        switch (name) {
            case ViewName.ACHIEVEMENTS:
                this.showSubViewButtons([]);
                break;
            case ViewName.INVENTORY:
                this.showSubViewButtons([]);
                break;
            case ViewName.MAIN_MENU:
                this.showSubViewButtons(main_menu_button_names);
                break;
            case ViewName.WORLD_MAP:
                this.showSubViewButtons([]);
                break;
            case ViewName.AREA:
                this.showSubViewButtons([]);
                break;
        }
    }

    /**
     * Hide all buttons except the top menu bar
     */
    public hideAllSubViewButtons() {
        const active = top_menu_button_names;
        this.game.model.buttons.forEach((button) => {
            button.is_visible = active.includes(button.name as MenuButtonName);
        });
    }

    /**
     * Show the buttons with the given names
     * @param buttons 
     */
    public showSubViewButtons(buttons: Array<MenuButtonName>) {
        this.game.model.buttons.forEach((button) => {
            if (buttons.includes(button.name as MenuButtonName)) {
                button.is_visible = true;
            }
        });
    }
}