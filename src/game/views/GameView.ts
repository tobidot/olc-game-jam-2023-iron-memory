import { GameModel } from "../models/GameModel";
import { View, ViewSettings } from "../../library/abstract/mvc/View";
import { GameBaseView } from "../../library";
import { MenuView } from "../../library/abstract/mvc/components/menu/MenuView";

export class GameView extends GameBaseView implements View {
    public settings: ViewSettings = {
        color_primary: "#ccc",
        color_secondary: "#000",
        color_tertiary: "#444",
        font_family: "monospace",
        font_size_text: 16,
    };
    protected menu_view: MenuView;

    public constructor(
        public context: CanvasRenderingContext2D,
    ) {
        super(context);
        this.resetCanvasState();
        this.menu_view = new MenuView(context, this.settings);
    }

    public update(delta_ms: number): void {
        // do nothing
    }

    /**
     * Render the complete game state
     * @param model 
     */
    public render(model: GameModel): void {
        super.render(model);
        this.render_game(model);
        this.render_top_bar(model);
    }

    /**
     * Renders the top menu bar of the game
     * @param model 
     */
    public render_top_bar(model: GameModel) {
        this.context.fillStyle = this.settings.color_primary;
        this.context.fillRect(0, 0, this.context.canvas.width, 30);        
        model.buttons.forEach((button) => {
            this.menu_view.render(button);
        });
    }

    /**
     * Render the actual game state
     * @param model 
     */
    public render_game(model: GameModel): void {

    }
}