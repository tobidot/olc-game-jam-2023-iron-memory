import { GameModel } from "../models/GameModel";
import { ViewSettings } from "../../library/abstract/mvc/View";
import { Entity } from "../models/Entity";
import { Agent, AgentImageName } from "../models/Agent";
import { Effect, EffectImageName } from "../models/Effect";
import { ImageAsset } from "../../library";
import { Rect } from "../../library/math/Rect";
import { Obstacle, ObstacleImageName } from "../models/Obstacle";

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
            .filter((entity): entity is Agent => entity instanceof Agent)
            .sort((a, b) => a.physics.shape.getOuterBox().bottom - b.physics.shape.getOuterBox().bottom)
            .forEach((entity) => this.renderAgent(entity));
        // render obstacles
        entities
            .filter((entity): entity is Obstacle => entity instanceof Obstacle)
            .sort((a, b) => a.rect.bottom - b.rect.bottom)
            .forEach((entity) => this.renderObstacle(entity));
        // render effects
        entities
            .filter((entity): entity is Effect => entity instanceof Effect)
            .forEach((entity) => this.renderEffect(entity));
        // render debug
        // entities
        // .forEach((entity) => this.renderEntityDebug(entity));
    }

    public renderObstacle(entity: Obstacle): void {
        const image = entity.images.get(ObstacleImageName.DEFAULT);
        this.renderImage(entity.rect, image);
    }

    public renderEffect(effect: Effect): void {
        this.context.save();
        this.context.globalAlpha = effect.alpha;
        this.context.translate(effect.rect.center.x, effect.rect.center.y);
        this.context.rotate(effect.rotation + Math.PI / 2);
        if (effect.images instanceof Map) {
            const image = effect.images.get(EffectImageName.DEFAULT);
            this.renderImage(effect.rect.cpy().move(effect.rect.center.cpy().mul(-1)), image);
        } else {
            this.context.fillStyle = effect.images.color;
            this.context.fillText(effect.images.text, -effect.rect.w / 2, -effect.rect.h / 2);
        }
        this.context.restore();
    }

    public renderAgent(agent: Agent): void {
        const offset = { x: agent.render_box.w / 2, y: agent.render_box.h / 2 }
        const position = agent.render_box.center.cpy().sub(offset);
        this.context.globalAlpha = 1;
        const image = agent.images.get(AgentImageName.DEFAULT);
        const rect = agent.render_box.cpy();
        rect.width = agent.render_box.w;
        rect.height = agent.render_box.h;
        this.renderImage(rect, image);

        // render life bar
        const life_bar =  Rect.fromLeftTopWidthHeight(
            rect.left,
            rect.top - 5,
            rect.width * agent.hitpoints / agent.max_hitpoints,
            3
        );
        this.context.fillStyle = "#f00";
        this.context.fillRect(
            life_bar.left, life_bar.top,
            life_bar.width, life_bar.height
        );
    }

    public renderImage(rect: Rect, image?: ImageAsset): void {
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