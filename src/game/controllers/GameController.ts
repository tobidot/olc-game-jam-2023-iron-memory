import { GameBaseController, MenuModel } from "../../library";
import { Controller } from "../../library/abstract/mvc/Controller";
import { ControllerResponse } from "../../library/abstract/mvc/Response";
import { Game } from "../base/Game";

export class GameController extends GameBaseController implements Controller {


    public constructor(
        protected readonly game: Game,
    ) {
        super(game);

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
        super.update(delta_seconds);
        this.game.model.update(delta_seconds);
        return null;
    }

    public onMenuSelect(item: MenuModel): void {
        switch (item.name) {
            case "new_game":
                this.newGame();
                break;
            case "toggle_sound":
                // this.game.audio.toggleSound();
                break;
        }
    }
}