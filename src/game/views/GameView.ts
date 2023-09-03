import { GameModel } from "../models/GameModel";
import { View, ViewSettings } from "../../library/abstract/mvc/View";
import { GameBaseView } from "../../library";
import { MenuView } from "../../library/abstract/mvc/components/menu/MenuView";
import { ViewName } from "../consts/ViewName";
import { MapView } from "./MapView";
import { InventoryView } from "./InventoryView";
import { AchievementView } from "./AchievementView";
import { AreaView } from "./AreaView";

export class GameView extends GameBaseView implements View {
    public settings: ViewSettings = {
        color_primary: "#ccc",
        color_secondary: "#000",
        color_tertiary: "#444",
        font_family: "monospace",
        font_size_text: 16,
    };
    protected menu_view: MenuView;
    protected inventory_view: InventoryView;
    protected achievement_view: AchievementView;
    protected map_view: MapView;
    protected area_view: AreaView;

    public constructor(
        public context: CanvasRenderingContext2D,
    ) {
        super(context);
        this.resetCanvasState();
        this.menu_view = new MenuView(context, this.settings);
        this.inventory_view = new InventoryView(context, this.settings);
        this.achievement_view = new AchievementView(context, this.settings);
        this.map_view = new MapView(context, this.settings);
        this.area_view = new AreaView(context, this.settings);
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
        // render the active view
        switch (model.active_view) {
            case ViewName.AREA:
                this.area_view.render(model);
                break;
            case ViewName.WORLD_MAP:
                this.map_view.render(model);
                break;
            case ViewName.INVENTORY:
                this.inventory_view.render(model);
                break;
            case ViewName.ACHIEVEMENTS:
                this.achievement_view.render(model);
                break;
        }
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


}