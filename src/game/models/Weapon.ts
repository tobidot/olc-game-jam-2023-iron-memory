import { ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Game } from "../base/Game";
import { WeaponAchievement, WeaponAchievementProgress } from "../consts/WeaponAchievements";
import { Agent, AgentImageName } from "./Agent";
import { AttackAttributes } from "./AttackAttributes";

export class Weapon extends Agent {
    public achievement_progress: Map<WeaponAchievement, WeaponAchievementProgress>;
    public latest_achievement: WeaponAchievement | null = null;

    public constructor(
        game: Game,
        position: Vector2D,
        images: Map<AgentImageName, ImageAsset>,
    ) {
        super(game, Rect.fromCenterAndSize(position, new Vector2D(10, 10)), images, false);
        this.is_neutral = true;
        this.achievement_progress = new Map([
            [WeaponAchievement.FIRST_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.FIRST_10_KILL, new WeaponAchievementProgress(10)],
            [WeaponAchievement.FIRST_100_KILL, new WeaponAchievementProgress(100)],
            [WeaponAchievement.FIRST_DUMMY_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.FIRST_SWORD_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.SOUL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.VETERAN, new WeaponAchievementProgress(50)],
            [WeaponAchievement.TRAVELER, new WeaponAchievementProgress(25)],
        ]);
    }

    public modifyLightAttack(attack: AttackAttributes): AttackAttributes {
        const achievement_count = [...this.achievement_progress.values()].reduce((acc, next) => acc + (next.achieved?1:0), 0);
        attack.cooldown_seconds = Math.max(attack.cooldown_seconds - Math.sqrt(achievement_count) / 10, 0.15);
        return attack;
    }

    public modifyHeavyAttack(attack: AttackAttributes): AttackAttributes {
        const achievement_count = [...this.achievement_progress.values()].reduce((acc, next) => acc + (next.achieved?1:0), 0);
        attack.damage.physical = attack.damage.physical + achievement_count;
        attack.attack_range = attack.attack_range + achievement_count * 10;
        attack.attack_width = attack.attack_width + achievement_count * 10;
        return attack;
    }

    public increase(achievement: WeaponAchievement, amount: number) {
        if (this.achievement_progress.get(achievement)!.increase(amount)) {
            this.latest_achievement = achievement;
        };
    }
}
