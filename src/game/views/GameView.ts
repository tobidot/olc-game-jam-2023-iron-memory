import { GameModel } from "../models/GameModel";
import { View, ViewSettings } from "../../library/abstract/mvc/View";
import { GameBaseView } from "../../library";
import { MenuView } from "../../library/abstract/mvc/components/menu/MenuView";
import { ViewName } from "../consts/ViewName";
import { Entity } from "../models/Entity";
import { Agent, AgentImageName } from "../models/Agent";

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

        switch (model.active_view) {
            case ViewName.GAME:
                this.render_game(model);
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

    /**
     * Render the actual game state
     * @param model 
     */
    public render_game(model: GameModel): void {
        const entities = model.walkable_area.entities;
        // render normal entities
        entities
            // .filter(entity => !(entity instanceof Effect))
            .forEach((entity) => this.renderEntity(entity));
        // render effects
        // entities.filter(entity => entity instanceof Effect)
        //     .forEach((entity) => this.renderEntity(entity));
        // render debug
        // entities
            // .forEach((entity) => this.renderEntityDebug(entity));
    }

    public renderEntity(entity: Entity): void {
        if (!(entity instanceof Agent)) {
            return ;
        }
        const offset = { x: entity.render_box.w / 2, y: entity.render_box.h / 2 }
        const position = entity.render_box.center.cpy().sub(offset);
        this.context.globalAlpha = 1;
        const image = entity.images.get(AgentImageName.DEFAULT);
        const rect = entity.render_box.cpy();
        rect.width = entity.render_box.w;
        rect.height = entity.render_box.h;
        if (!image) {
            this.context.fillStyle = "#f00";
            this.context.fillRect(
                rect.left, rect.top,
                rect.width, rect.height
            );
        } else {
            this.context.drawImage(
                image.image,
                rect.left, rect.top,
                rect.width, rect.height
            );
        }

    }
}