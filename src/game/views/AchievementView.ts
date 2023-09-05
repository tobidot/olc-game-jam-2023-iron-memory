import { GameModel } from "../models/GameModel";
import { ViewSettings } from "../../library/abstract/mvc/View";
import { Vector2D } from "../../library/math";
import { WeaponAchievement, weapon_achievement_descriptions } from "../consts/WeaponAchievements";
import { AttackModifier } from "../models/AttackAttributes";

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
        let offset = 0;
        this.context.save();
        this.context.textAlign = "left";
        this.context.textBaseline = "top";
        this.context.translate(0, -this.scroll_offset);
        [...weapon.achievement_progress.entries()]
            .sort(([_a, a], [_b, b]) => (a.achieved_at ?? Infinity) - (b.achieved_at ?? Infinity))
            .forEach(([achievement_type, progress]) => {
                if (progress.achieved) {
                    const position = new Vector2D(400, 80 + offset);
                    const description = weapon_achievement_descriptions.get(achievement_type);
                    if (!description) {
                        return;
                    }
                    const modifier_light_text = !!description.light ? this.buildModifierText(description.light) : [];
                    const modifier_heavy_text = !!description.heavy ? this.buildModifierText(description.heavy) : [];
                    const height = Math.max(
                        description.description.split("\n").length * 20,
                        modifier_light_text.length * 20,
                        modifier_heavy_text.length * 20,
                    )
                    const text = description.label + ": " + description.description;
                    if ([
                        WeaponAchievement.LICHS_CURSE,
                        WeaponAchievement.LICHS_CURSE_5,
                        WeaponAchievement.DRAGONS_CURSE,
                        WeaponAchievement.DRAGONS_CURSE_5,
                        WeaponAchievement.DEMONS_CURSE,
                        WeaponAchievement.DEMONS_CURSE_5,
                        WeaponAchievement.POSSESED,
                        WeaponAchievement.LAZY,
                    ].includes(achievement_type)) {
                        this.context.fillStyle = "#70a";
                    } else {
                        this.context.fillStyle = "#f22";
                    }
                    this.context.fillRect(10, position.y - 5, 780, height + 10);
                    // 
                    this.context.textAlign = "left";
                    this.context.fillStyle = "#fff";
                    this.context.font = "24px Gothic";
                    this.context.fillText(description.label, 20, position.y + height / 2 - 10);
                    //
                    this.context.textAlign = "left";
                    this.context.fillStyle = "#fff";
                    this.context.font = "16px Gothic";
                    const description_lines = description.description.split("\n");
                    description_lines.forEach((line, index) => {
                        this.context.fillText(line, 175, position.y + index * 20);
                    });
                    //
                    this.context.textAlign = "center";
                    this.context.fillStyle = "#fff";
                    modifier_light_text.forEach((line, index) => {
                        this.context.fillText(line, 500 + 75, position.y + index * 20);
                    });
                    //
                    this.context.textAlign = "center";
                    this.context.fillStyle = "#fff";
                    modifier_heavy_text.forEach((line, index) => {
                        this.context.fillText(line, 650 + 75, position.y + index * 20);
                    });
                    offset += height + 20;
                }
            });
        this.context.restore();


        this.context.save();
        this.context.fillStyle = "#000";
        this.context.fillRect(10, 30, 780, 40);
        this.context.textAlign = "left";
        this.context.textBaseline = "top";
        this.context.fillStyle = "#fff";
        this.context.font = "24px Gothic";
        this.context.fillText("Name", 20, 40);
        this.context.fillText("Description", 185, 40);
        this.context.fillText("Bonus Light", 510, 40);
        this.context.fillText("Bonus Heavy", 660, 40);
        this.context.restore();

        model.achievement_screen_height = offset;
    }

    /**
     * Build the text for a modifier
     * @param modifier 
     */
    public buildModifierText(modifier: AttackModifier): Array<string> {
        const attack_lines = Object.entries(modifier)
            .filter(([key, value]) => key !== "damage")
            .map(([key, value]) => {
                key = key.replace("_seconds", "");
                key = key.replace("_", " ");
                if (typeof value === "number") {
                    return `${key}: ${value.toFixed(2)}`;
                }
                return '';
            });
        const damage_lines = Object.entries(modifier.damage ?? {})
            .map(([key, value]) => {
                if (typeof value === "number") {
                    return `${key}: ${value.toFixed(2)}`;
                }
                return '';
            });

        return [
            ...attack_lines,
            ...damage_lines,
        ]
    }
}