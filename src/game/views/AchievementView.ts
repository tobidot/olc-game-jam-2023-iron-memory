import { GameModel } from "../models/GameModel";
import { ViewSettings } from "../../library/abstract/mvc/View";
import { Vector2D } from "../../library/math";
import { weapon_achievement_descriptions } from "../consts/WeaponAchievements";

export class AchievementView {
    public scroll_offset: number = 0;

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
        const hero = model.walkable_area.hero;
        if (!hero) {
            return;
        }
        const weapon = hero.weapon;
        if (!weapon) {
            return;
        }
        let count = 0;
        this.context.save();
        this.context.translate(0, this.scroll_offset);
        weapon.achievement_progress.forEach((achievement, index) => {
            if (achievement.achieved) {
                const position = new Vector2D(400, 50 + count * 25);
                const description = weapon_achievement_descriptions.get(index);
                if (!description) {
                    return ;
                }
                const text = description.label + ": " + description.description;
                this.context.fillStyle = "#f22";
                this.context.fillRect(10, position.y - 10, 780, 20);
                this.context.textAlign = "center";
                this.context.fillStyle = "#fff";
                this.context.font = "18px Gothic";
                this.context.fillText(text, position.x, position.y);
                count++;
            }
        });
        this.context.restore();
    }
}