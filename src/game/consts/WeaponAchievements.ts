import { AttackAttributes, AttackModifier } from "../models/AttackAttributes";
import { AttackDamage } from "../models/AttackDamage";

export enum WeaponAchievement {
    //
    FIRST_KILL,
    FIRST_10_KILL,
    FIRST_100_KILL,
    FIRST_500_KILL,
    //
    FIRST_SWORD_KILL,
    FIRST_5_SWORD_KILL,
    //
    FIRST_SIGN_KILL,
    // 
    FIRST_DOUBLE_KILL,
    FIRST_5_DOUBLE_KILL,
    FIRST_10_DOUBLE_KILL,
    FIRST_50_DOUBLE_KILL,
    FIRST_100_DOUBLE_KILL,
    FIRST_PENTA_KILL,
    FIRST_5_PENTA_KILL,
    FIRST_10_PENTA_KILL,
    FIRST_20_PENTA_KILL,
    //
    FIRST_10_GOBLIN_KILL,
    FIRST_50_GOBLIN_KILL,
    FIRST_100_GOBLIN_KILL,
    FIRST_10_SPIDER_KILL,
    FIRST_50_SPIDER_KILL,
    FIRST_100_SPIDER_KILL,
    FIRST_10_IMP_KILL,
    FIRST_50_IMP_KILL,
    FIRST_100_IMP_KILL,    
    //
    FIRST_BOSS_KILL,
    HOB_GOBLIN_KILL,
    ORC_KILL,
    TROLL_KILL,
    DRAGON_KILL,
    DEMON_KILL,
    LICH_KILL,
    // DEBUFFS
    LICHS_CURSE,
    LICHS_CURSE_5,
    DRAGONS_CURSE,
    DRAGONS_CURSE_5,
    DEMONS_CURSE,
    DEMONS_CURSE_5,
    // Take Heal
    FIRST_HEAL,
    FIRST_5_HEAL,
    FIRST_10_HEAL,
    FIRST_50_HEAL,
    FIRST_100_HEAL,
    // 
    EXPLORER,
    TRAVELER,
    SOUL,
    POSSESED,
    VETERAN,
    LAZY,
}

export interface WeaponAchievementDescription {
    id: WeaponAchievement;
    label: string;
    description: string;
    // the benefit of the achievement
    light?: AttackModifier;
    heavy?: AttackModifier;
}

export class WeaponAchievementProgress {
    public value: number = 0;
    public achieved: boolean = false;

    public constructor(
        public readonly required: number,
    ) {
    }

    public increase(amount: number): boolean {
        this.value += amount;
        if (this.value >= this.required && !this.achieved) {
            this.achieved = true;
            return true;
        }
        return false;
    }
}

function make(
    description: Partial<WeaponAchievementDescription>
        & Omit<WeaponAchievementDescription, "progress">
): [WeaponAchievement, WeaponAchievementDescription] {
    return [
        description.id,
        Object.assign({
        }, description)
    ];
}

/**
 * The descriptions of all weapon achievements
 * 
 * Base Value for balancing
 * Physicial: 2
 * Fire     : 3
 * Ice      : 4
 * Psy      : 5
 * 
 * Light attack modifiers are about 3 times as much worth as heavy attack modifiers
 */
export const weapon_achievement_descriptions = new Map<WeaponAchievement, WeaponAchievementDescription>([
    make({
        id: WeaponAchievement.FIRST_SIGN_KILL,
        label: "An easy Target",
        description: "Destroy an info sign.",
        heavy: {
            damage: {physical: 6},
        }
    }),
    make({
        id: WeaponAchievement.FIRST_KILL,
        label: "First Kill",
        description: "Kill your first enemy.\n Honor to you, brave warrior.",
        light: {
            damage: {physical: 1},
        }
    }),
    make({
        id: WeaponAchievement.FIRST_10_KILL,
        label: "10 Kills",
        description: "Kill 10 enemies.",
        light: {
            damage: {physical: 1},
        },
        heavy: {
            damage: {physical: 3},
        }
    }),
    make({
        id: WeaponAchievement.FIRST_100_KILL,
        label: "100 Kills",
        description: "Kill 100 enemies.",
        light: {
            damage: {physical: 2},
        },
        heavy: {
            damage: {physical: 6},
        }
    }),
    make({
        id: WeaponAchievement.FIRST_500_KILL,
        label: "500 Kills",
        description: "Kill 500 enemies.",
        light: {
            damage: { psy: 10},
        },
        heavy: {
            damage: {psy: 30},
        }
    }),
    //
    make({
        id: WeaponAchievement.FIRST_SWORD_KILL,
        label: "Grave desecrator",
        description: "Destroy a tombstone.",
        light: {
            damage: {physical: -1, psy: 1},
        },
        heavy: {
            damage: {physical: -3, psy: 3},
        },
    }),
    make({
        id: WeaponAchievement.FIRST_5_SWORD_KILL,
        label: "Grave robber",
        description: "Destroy 5 tombstones.",
        light: {
            damage: {physical: -2, psy: 4},
        },
        heavy: {
            damage: {physical: -6, psy: 12},
        },
    }),
    //
    make({
        id: WeaponAchievement.FIRST_DOUBLE_KILL,
        label: "Double Kill",
        description: "Kill 2 enemies with a single attack.",
        light: {
            attack_width: 10,
            attack_range: 20,
            cooldown_seconds: -0.05,
        },
    }),
    make({
        id: WeaponAchievement.FIRST_5_DOUBLE_KILL,
        label: "5 Double Kills",
        description: "Kill 2 enemies with a single attack, 5 times.",
        light: {
            damage: {physical: 1},
            attack_width: 10,
            attack_range: 20,
            cooldown_seconds: -0.025,
        },
    }),
    make({
        id: WeaponAchievement.FIRST_10_DOUBLE_KILL,
        label: "10 Double Kills",
        description: "Kill 2 enemies with a single attack, 10 times.",
        light: {
            damage: {physical: 1},
            attack_width: 10,
            attack_range: 20,
            cooldown_seconds: -0.025,
        },
    }),
    make({
        id: WeaponAchievement.FIRST_50_DOUBLE_KILL,
        label: "50 Double Kills",
        description: "Kill 2 enemies with a single attack, 50 times.",
        light: {
            damage: {physical: 1},
            attack_width: 10,
            attack_range: 20,
            cooldown_seconds: -0.025,
        },
    }),
    make({
        id: WeaponAchievement.FIRST_100_DOUBLE_KILL,
        label: "100 Double Kills",
        description: "Kill 2 enemies with a single attack, 100 times.",
        light: {
            damage: {physical: 3},
            attack_width: 30,
            attack_range: 50,
            cooldown_seconds: -0.05,
        },
    }),
    //
    make({
        id: WeaponAchievement.FIRST_PENTA_KILL,
        label: "Penta Kill",
        description: "Kill 5 enemies with a single attack.",
        heavy: {
            damage: {physical: 6},
            attack_width: 30,
            attack_range: 30,
            channel_seconds: 0.025,
        },
    }),
    make({
        id: WeaponAchievement.FIRST_5_PENTA_KILL,
        label: "Penta, Penta",
        description: "Kill 5 enemies with a single attack, 5 times.",
        heavy: {
            damage: {physical: 6},
            attack_width: 30,
            attack_range: 30,
            channel_seconds: 0.025,
        },
    }),
    make({
        id: WeaponAchievement.FIRST_10_PENTA_KILL,
        label: "10 Pentakills",
        description: "Kill 5 enemies with a single attack, 10 times.",
        heavy: {
            damage: {physical: 6},
            attack_width: 30,
            attack_range: 30,
            channel_seconds: 0.025,
        },
    }),
    make({
        id: WeaponAchievement.FIRST_20_PENTA_KILL,
        label: "20 Pentakills",
        description: "Kill 5 enemies with a single attack, 20 times.",
        heavy: {
            damage: {physical: 12},
            attack_width: 60,
            attack_range: 60,
            channel_seconds: 0.05,
        },
    }),
    //
    make({
        id: WeaponAchievement.FIRST_10_GOBLIN_KILL,
        label: "Goblin Seeker",
        description: "Kill 10 goblins.",
        light: {
            damage: {physical: 1 },
        },
        heavy: {
            damage: {physical: 3},
        }
    }),
    make({
        id: WeaponAchievement.FIRST_50_GOBLIN_KILL,
        label: "Goblin Slayer",
        description: "Kill 50 goblins.",
        light: {
            damage: {physical: 1 },
        },
        heavy: {
            damage: {physical: 3},
        }
    }),
    make({
        id: WeaponAchievement.FIRST_100_GOBLIN_KILL,
        label: "Goblin Terror",
        description: "Kill 100 goblins.",
        light: {
            damage: {physical: 2 },
        },
        heavy: {
            damage: {physical: 6},
        }
    }),
    make({
        id: WeaponAchievement.FIRST_10_SPIDER_KILL,
        label: "Spider Squasher",
        description: "Kill 10 spiders.",
        light: {
            damage: {fire: 1},
        },
        heavy: {
            damage: {fire: 3},
        }
    }),
    make({
        id: WeaponAchievement.FIRST_50_SPIDER_KILL,
        label: "Spider Exterminator",
        description: "Kill 50 spiders.",
        light: {
            damage: {fire: 1},
        },
        heavy: {
            damage: {fire: 3},
        }
    }),
    make({
        id: WeaponAchievement.FIRST_100_SPIDER_KILL,
        label: "Spider Terror",
        description: "Kill 100 spiders.",
        light: {
            damage: {fire: 2 },
        },
        heavy: {
            damage: {fire: 6},
        }
    }),
    //
    make({
        id: WeaponAchievement.FIRST_10_IMP_KILL,
        label: "Imp Hunter",
        description: "Kill 10 imps.",
        light: {
            damage: {psy: 1},
        },
        heavy: {
            damage: {psy: 3},
        }
    }),
    make({
        id: WeaponAchievement.FIRST_50_IMP_KILL,
        label: "Cleric",
        description: "Kill 50 imps.",
        light: {
            damage: {psy: 1},
        },
        heavy: {
            damage: {psy: 3},
        }
    }),
    make({
        id: WeaponAchievement.FIRST_100_IMP_KILL,
        label: "Hell's Bane",
        description: "Kill 100 imps.",
        light: {
            damage: {psy: 2},
        },
        heavy: {
            damage: {psy: 6},
        }
    }),
    //
    make({
        id: WeaponAchievement.FIRST_BOSS_KILL,
        label: "Hero",
        description: "Kill a boss.",
        light: {
            damage: {fire: 1, ice: 1, psy: 1},
            cooldown_seconds: -0.1,
        },
        heavy: {
            damage: {fire: 2, ice: 2, psy: 2, physical: 5},            
            channel_seconds: -0.1,
        }
    }),
    make({
        id: WeaponAchievement.HOB_GOBLIN_KILL,
        label: "Hobgoblin",
        description: "Kill a hobgoblin.",
        light: {
            damage: {physical: 3},
        },
        heavy: {
            damage: {physical: 10},
        }
    }),
    make({
        id: WeaponAchievement.ORC_KILL,
        label: "Orc",
        description: "Kill an orc.",
        light: {
            attack_width: 25,
        },
        heavy: {
            attack_width: 75,
        }
    }),
    make({
        id: WeaponAchievement.TROLL_KILL,
        label: "Troll",
        description: "Kill a troll.",
        light: {
            cooldown_seconds: -0.05,
        },
        heavy: {
            cooldown_seconds: -0.1,
        }
    }),
    make({
        id: WeaponAchievement.DRAGON_KILL,
        label: "Dragon",
        description: "Kill a dragon.",
        light: {
            damage: {fire: 6},
        },
        heavy: {
            damage: {fire: 20},
        }
    }),
    make({
        id: WeaponAchievement.DEMON_KILL,
        label: "Demon",
        description: "Kill a demon.",
        light: {
            damage: {psy: 5},
        },
        heavy: {
            damage: {psy: 15},
        }
    }),
    make({
        id: WeaponAchievement.LICH_KILL,
        label: "Lich",
        description: "Kill a lich.",
        light: {
            damage: {ice: 5},
        },
        heavy: {
            damage: {ice: 15},
        }
    }),
    //
    make({
        id: WeaponAchievement.LICHS_CURSE,
        label: "Lich's Curse",
        description: "Get hit by the curse of the lich.",
        light: {
            damage: {ice: -1, psy: -1, fire: -1, physical: -1},
        },
        heavy: {
            damage: {ice: -2, psy: -2, fire: -2, physical: -2},
        }
    }),
    make({
        id: WeaponAchievement.LICHS_CURSE_5,
        label: "Dragon's Curse x5",
        description: "Get hit 5 times by the curse of the lich.",
        light: {
            damage: {ice: -10, psy: -10, fire: -10, physical: -10},
        },
        heavy: {
            damage: {ice: -20, psy: -20, fire: -20, physical: -20},
        }
    }),
    make({
        id: WeaponAchievement.DRAGONS_CURSE,
        label: "Dragon's Curse",
        description: "Get hit by the curse of the dragon.",
        light: {
            damage: {ice: -1, psy: -1, fire: -1, physical: -1},
        },
        heavy: {
            damage: {ice: -2, psy: -2, fire: -2, physical: -2},
        }
    }),
    make({
        id: WeaponAchievement.DRAGONS_CURSE_5,
        label: "Dragon's Curse x5",
        description: "Get hit 5 times by the curse of the dragon.",
        light: {
            damage: {ice: -10, psy: -10, fire: -10, physical: -10},
        },
        heavy: {
            damage: {ice: -20, psy: -20, fire: -20, physical: -20},
        }
    }),
    make({
        id: WeaponAchievement.DEMONS_CURSE,
        label: "Demon's Curse",
        description: "Get hit by the curse of the demon.",
        light: {
            damage: {ice: -1, psy: -1, fire: -1, physical: -1},
        },
        heavy: {
            damage: {ice: -2, psy: -2, fire: -2, physical: -2},
        }
    }),
    make({
        id: WeaponAchievement.DEMONS_CURSE_5,
        label: "Demon's Curse x5",
        description: "Get hit 5 times by the curse of the demon.",
        light: {
            damage: {ice: -10, psy: -10, fire: -10, physical: -10},
        },
        heavy: {
            damage: {ice: -20, psy: -20, fire: -20, physical: -20},
        }
    }),
    //
    make({
        id: WeaponAchievement.FIRST_HEAL,
        label: "First Heal",
        description: "Heal yourself.",
        light: {
            attack_range: 10,
        },
        heavy: {
            channel_seconds: -0.05,
        }
    }),
    make({
        id: WeaponAchievement.FIRST_5_HEAL,
        label: "5 Heals",
        description: "Heal yourself, 5 times.",
        light: {
            attack_range: 10,
        },
        heavy: {
            channel_seconds: -0.05,
        }
    }),
    make({
        id: WeaponAchievement.FIRST_10_HEAL,
        label: "10 Heals",
        description: "Heal yourself, 10 times.",
        light: {
            attack_range: 10,
        },
        heavy: {
            channel_seconds: -0.05,
        }
    }),
    make({
        id: WeaponAchievement.FIRST_50_HEAL,
        label: "50 Heals",
        description: "Heal yourself, 50 times.",
        light: {
            attack_range: 10,
        },
        heavy: {
            channel_seconds: -0.05,
        }
    }),
    make({
        id: WeaponAchievement.FIRST_100_HEAL,
        label: "100 Heals",
        description: "Heal yourself, 100 times.",
        light: {
            attack_range: 10,
        },
        heavy: {
            channel_seconds: -0.05,
        }
    }),
    make({
        id: WeaponAchievement.EXPLORER,
        label: "Explorer",
        description: "Discover the entire map.",
        light: {
            cooldown_seconds: -0.05,
            damage: {physical: 1},
        }
    }),
    make({
        id: WeaponAchievement.TRAVELER,
        label: "Traveler",
        description: "Travel accross 25 different tiles.",
        light: {
            cooldown_seconds: -0.05,
            damage: {physical: 1},
        }
    }),
    make({
        id: WeaponAchievement.VETERAN,
        label: "Veteran",
        description: "Someone died of old age, while holding a firm grip to this sword.",
    }),
    make({
        id: WeaponAchievement.SOUL,
        label: "Soul link",
        description: "Someone died with this sword in hand.",
        light: {
            damage: {psy: 1},
        },
        heavy: {
            damage: {psy: 3},
        }
    }),
    make({
        id: WeaponAchievement.POSSESED,
        label: "Posessed",
        description: "5 Warriors died with this sword in hand.",
        light: {
            channel_seconds: 0.5,
            damage: {psy: 10},
        },
        heavy: {
            channel_seconds: 1.0,
            damage: {psy: 20},
        }
    }),
    make({
        id: WeaponAchievement.LAZY,
        label: "Lazy",
        description: "Stand still for a minute.",
        heavy: {
            channel_seconds: 0.1,
        }
    }),

]);