import { ImageAsset, assert } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Game } from "../base/Game";
import { WeaponAchievement, WeaponAchievementProgress, weapon_achievement_descriptions } from "../consts/WeaponAchievements";
import { Agent, AgentImageName } from "./Agent";
import { AttackAttributes } from "./AttackAttributes";
import { Hero } from "./Hero";

export class Weapon extends Agent {
    public achievement_progress: Map<WeaponAchievement, WeaponAchievementProgress>;
    public latest_achievement: WeaponAchievement | null = null;
    public hero: Hero | null = null;
    // achivement data
    public unmoved_seconds: number = 0;
    public visited_areas: Set<string> = new Set();

    public constructor(
        game: Game,
        position: Vector2D,
        images: Map<AgentImageName, ImageAsset>,
    ) {
        super(game, Rect.fromCenterAndSize(position, new Vector2D(32, 32)), images, false);
        this.is_neutral = true;
        this.physics.fixed = true;
        this.achievement_progress = new Map([
            [WeaponAchievement.FIRST_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.FIRST_10_KILL, new WeaponAchievementProgress(10)],
            [WeaponAchievement.FIRST_100_KILL, new WeaponAchievementProgress(100)],
            [WeaponAchievement.FIRST_SIGN_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.FIRST_SWORD_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.FIRST_5_SWORD_KILL, new WeaponAchievementProgress(5)],
            [WeaponAchievement.FIRST_DOUBLE_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.FIRST_5_DOUBLE_KILL, new WeaponAchievementProgress(5)],
            [WeaponAchievement.FIRST_10_DOUBLE_KILL, new WeaponAchievementProgress(10)],
            [WeaponAchievement.FIRST_50_DOUBLE_KILL, new WeaponAchievementProgress(50)],
            [WeaponAchievement.FIRST_100_DOUBLE_KILL, new WeaponAchievementProgress(100)],
            [WeaponAchievement.FIRST_PENTA_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.FIRST_5_PENTA_KILL, new WeaponAchievementProgress(5)],
            [WeaponAchievement.FIRST_10_PENTA_KILL, new WeaponAchievementProgress(10)],
            [WeaponAchievement.FIRST_20_PENTA_KILL, new WeaponAchievementProgress(20)],
            [WeaponAchievement.FIRST_10_GOBLIN_KILL, new WeaponAchievementProgress(10)],
            [WeaponAchievement.FIRST_50_GOBLIN_KILL, new WeaponAchievementProgress(50)],
            [WeaponAchievement.FIRST_100_GOBLIN_KILL, new WeaponAchievementProgress(100)],
            [WeaponAchievement.FIRST_10_SPIDER_KILL, new WeaponAchievementProgress(10)],
            [WeaponAchievement.FIRST_50_SPIDER_KILL, new WeaponAchievementProgress(50)],
            [WeaponAchievement.FIRST_100_SPIDER_KILL, new WeaponAchievementProgress(100)],
            [WeaponAchievement.FIRST_10_IMP_KILL, new WeaponAchievementProgress(10)],
            [WeaponAchievement.FIRST_50_IMP_KILL, new WeaponAchievementProgress(50)],
            [WeaponAchievement.FIRST_100_IMP_KILL, new WeaponAchievementProgress(100)],
            [WeaponAchievement.FIRST_BOSS_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.HOB_GOBLIN_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.ORC_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.TROLL_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.DRAGON_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.DEMON_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.LICH_KILL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.LICHS_CURSE, new WeaponAchievementProgress(1)],
            [WeaponAchievement.LICHS_CURSE_5, new WeaponAchievementProgress(5)],
            [WeaponAchievement.DRAGONS_CURSE, new WeaponAchievementProgress(1)],
            [WeaponAchievement.DRAGONS_CURSE_5, new WeaponAchievementProgress(5)],
            [WeaponAchievement.DEMONS_CURSE, new WeaponAchievementProgress(1)],
            [WeaponAchievement.DEMONS_CURSE_5, new WeaponAchievementProgress(5)],
            [WeaponAchievement.EXPLORER, new WeaponAchievementProgress(1)],
            [WeaponAchievement.TRAVELER, new WeaponAchievementProgress(25)],
            [WeaponAchievement.SOUL, new WeaponAchievementProgress(1)],
            [WeaponAchievement.POSSESED, new WeaponAchievementProgress(5)],
            [WeaponAchievement.VETERAN, new WeaponAchievementProgress(50)],
        ]);
    }

    public update(delta_seconds: number) {
        super.update(delta_seconds);
        if (!!this.hero) {
            // idle for a minute
            if (this.hero.physics.velocity.length2() > 0) {
                this.unmoved_seconds = 0;
            } else {
                this.unmoved_seconds += delta_seconds;
                if (this.unmoved_seconds > 60) {
                    this.increase(WeaponAchievement.LAZY, 1);
                }
            }
        }
    }

    public modifyLightAttack(attack: AttackAttributes): AttackAttributes {
        for (const [achievement, progress] of this.achievement_progress.entries()) {
            if (!progress.achieved) {
                continue;
            }
            const description = weapon_achievement_descriptions.get(achievement);
            assert(!!description);
            const modifier = description.light;
            if (modifier) {
                attack.damage.physical = attack.damage.physical + (modifier.damage?.physical ?? 0);
                attack.damage.psy = attack.damage.psy + (modifier.damage?.psy ?? 0);
                attack.damage.fire = attack.damage.fire + (modifier.damage?.fire ?? 0);
                attack.damage.ice = attack.damage.ice + (modifier.damage?.ice ?? 0);
                attack.attack_range = attack.attack_range + (modifier.attack_range ?? 0);
                attack.attack_width = attack.attack_width + (modifier.attack_width ?? 0);
                attack.cooldown_seconds = attack.cooldown_seconds + (modifier.cooldown_seconds ?? 0);
                attack.channel_seconds = attack.channel_seconds + (modifier.channel_seconds ?? 0);
            }
        }
        // const achievement_count = [...this.achievement_progress.values()].reduce((acc, next) => acc + (next.achieved?1:0), 0);
        // attack.cooldown_seconds = Math.max(attack.cooldown_seconds - Math.sqrt(achievement_count) / 10, 0.15);
        return attack;
    }

    public modifyHeavyAttack(attack: AttackAttributes): AttackAttributes {
        for (const [achievement, progress] of this.achievement_progress.entries()) {
            if (!progress.achieved) {
                continue;
            }
            const description = weapon_achievement_descriptions.get(achievement);
            assert(!!description);
            const modifier = description.heavy;
            if (modifier) {
                attack.damage.physical = attack.damage.physical + (modifier.damage?.physical ?? 0);
                attack.damage.psy = attack.damage.psy + (modifier.damage?.psy ?? 0);
                attack.damage.fire = attack.damage.fire + (modifier.damage?.fire ?? 0);
                attack.damage.ice = attack.damage.ice + (modifier.damage?.ice ?? 0);
                attack.attack_range = attack.attack_range + (modifier.attack_range ?? 0);
                attack.attack_width = attack.attack_width + (modifier.attack_width ?? 0);
                attack.cooldown_seconds = attack.cooldown_seconds + (modifier.cooldown_seconds ?? 0);
                attack.channel_seconds = attack.channel_seconds + (modifier.channel_seconds ?? 0);
            }
        }
        // const achievement_count = [...this.achievement_progress.values()].reduce((acc, next) => acc + (next.achieved?1:0), 0);
        // attack.damage.physical = attack.damage.physical + achievement_count;
        // attack.attack_range = attack.attack_range + achievement_count * 10;
        // attack.attack_width = attack.attack_width + achievement_count * 10;
        return attack;
    }

    public increase(achievement: WeaponAchievement, amount: number) {
        if (this.achievement_progress.get(achievement)!.increase(amount)) {
            this.latest_achievement = achievement;
        };
    }
}
