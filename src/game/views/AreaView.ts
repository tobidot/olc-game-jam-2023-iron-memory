import { GameModel } from "../models/GameModel";
import { ViewSettings } from "../../library/abstract/mvc/View";
import { Entity } from "../models/Entity";
import { Agent, AgentImageName } from "../models/Agent";
import { Effect, EffectImageName } from "../models/Effect";
import { Asset, ImageAsset } from "../../library";
import { Rect } from "../../library/math/Rect";
import { Obstacle, ObstacleImageName } from "../models/Obstacle";
import { weapon_achievement_descriptions } from "../consts/WeaponAchievements";
import { Vector2D } from "../../library/math";
import { WorldMapAreaType } from "../consts/WorldMapAreaType";
import { Assets } from "../base/Assets";

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
        this.renderBackground(model);
        this.renderEntities(model);
        this.renderAge(model);
        this.renderLatestAchievement(model);
        this.renderMapClear(model);
    }

    /**
     * Show a bar that indicates the age of the hero
     * The older the hero, the more red the bar gets until age 100
     * @param model 
     */
    public renderAge(model: GameModel) {
        const hero = model.walkable_area.hero;
        if (!hero) {
            return;
        }
        const age = hero.age;
        const position = new Vector2D(0, 30);
        const width = 800;
        const height = 20;
        const age_bar = Rect.fromLeftTopWidthHeight(
            position.x,
            position.y,
            width * age / 100,
            height
        );
        this.context.save();
        const color = (() => {
            if (age < 50) {
                return "#0f0";
            } else if (age < 75) {
                return "#ff0";
            } else {
                return "#f00";
            }
        })();
        this.context.fillStyle = color;
        this.context.fillRect(
            age_bar.left, age_bar.top,
            age_bar.width, age_bar.height
        );
        this.context.fillStyle = "#000";
        this.context.textAlign = "left";
        this.context.fillText("Age: " + age.toFixed(0), position.x + 10, position.y + height / 2);
        this.context.restore();
    }

    public renderBackground(model: GameModel) {
        const area = model.world_map.getCurrentArea();
        const asset = (() => {
            switch (area.type) {
                case WorldMapAreaType.GRAS: return model.game.assets.getImage(Assets.images.background.gras_background);
                case WorldMapAreaType.FORREST: return model.game.assets.getImage(Assets.images.background.forrest_background);
                case WorldMapAreaType.MOUNTAIN: return model.game.assets.getImage(Assets.images.background.mountain_background);
                case WorldMapAreaType.VILLAGE: return model.game.assets.getImage(Assets.images.background.village_background);
                case WorldMapAreaType.DUNGEON: return model.game.assets.getImage(Assets.images.background.dungeon_background);
                default: throw new Error('Unknown area type');
            }
        })();
        if (asset instanceof ImageAsset) {
            this.context.drawImage(
                asset.image,
                0, 0,
                800, 600
            );
        } else {
            this.context.fillStyle = "#000";
            this.context.fillRect(
                0, 0,
                800, 600
            );
        }
    }

    public renderLatestAchievement(model: GameModel) {

        // render latest achievement
        const hero = model.walkable_area.hero;
        if (!hero) {
            return;
        }
        const weapon = hero.weapon;
        if (!weapon) {
            return;
        }
        const achievement = weapon.latest_achievement;
        if (achievement === null) {
            return;
        }
        const description = weapon_achievement_descriptions.get(achievement);
        if (!description) {
            return;
        }
        const text = description.label;
        const position = new Vector2D(0, 50);
        this.context.save();
        this.context.font = "24px Arial";
        this.context.textAlign = "left";
        // draw background rect
        const width = this.context.measureText(text).width + 20;
        const height = 30;
        const rect = Rect.fromLeftTopWidthHeight(
            position.x,
            position.y,
            width,
            height
        );
        this.context.fillStyle = "#000";
        this.context.fillRect(
            rect.left, rect.top,
            rect.width, rect.height
        );
        // 
        this.context.fillStyle = "#fff";
        this.context.fillText(text, position.x + 10, position.y + height / 2);
        this.context.restore();
    }

    /**
     * Show a game won screen, as the map has been cleared
     * @param model 
     */
    public renderMapClear(model: GameModel) {
        if (!model.world_map.isCleared()) {
            return;
        }
        const position = new Vector2D(400, 300);
        this.context.save();
        this.context.font = "32px Arial";
        this.context.fillStyle = "#fff";
        this.context.textAlign = "center";
        this.context.fillText("You have cleared the map!", position.x, position.y);
        this.context.fillText("All bosses are dead!", position.x, position.y + 30);
        this.context.font = "18px Arial";
        this.context.fillText("You can start the next level via the menu now", position.x, position.y + 60);
        this.context.restore();
    }

    /**
     * Render the actual game state
     * @param model 
     */
    public renderEntities(model: GameModel): void {
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
            const color = effect.images.color;
            const lines = effect.images.text.split('\n');
            lines.forEach((line, index) => {
                this.context.fillStyle = color;
                this.context.fillText(line, -effect.rect.w / 2, -effect.rect.h / 2 + 20 * index - lines.length * 20);
            });
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
        const life_bar = Rect.fromLeftTopWidthHeight(
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

        // show a channeling symbol if the agent is channeling
        if (agent.channel !== null) {
            const channeling_rect = Rect.fromLeftTopWidthHeight(
                rect.center.x - 10,
                rect.top - 20,
                20,
                20
            );
            const image = agent.game.assets.getImage( Assets.images.effects.channel);
            this.renderImage(channeling_rect, image);
        }
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