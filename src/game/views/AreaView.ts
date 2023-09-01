import { GameModel } from "../models/GameModel";
import { ViewSettings } from "../../library/abstract/mvc/View";
import { Entity } from "../models/Entity";
import { Agent, AgentImageName } from "../models/Agent";

/**
 * The area view renders the walkable area and all entities in it
 */
export class AreaView {

    public constructor(
        public context: CanvasRenderingContext2D,
        public settings: ViewSettings,
    ) {
    }

    public update(delta_ms: number): void {
        // do nothing
    }

    /**
     * Render the complete game state
     * @param model 
     */
    public render(model: GameModel): void {
        this.render_entities(model);
    }

    /**
     * Render the actual game state
     * @param model 
     */
    public render_entities(model: GameModel): void {
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