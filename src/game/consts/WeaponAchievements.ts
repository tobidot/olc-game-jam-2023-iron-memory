export enum WeaponAchievement {
    FIRST_KILL,
    FIRST_10_KILL,
    FIRST_100_KILL,
    FIRST_200_KILL,
    FIRST_SWORD_KILL,
    FIRST_DUMMY_KILL,
    VETERAN,
    SOUL,
    TRAVELER,
}

export interface WeaponAchievementDescription {
    id: WeaponAchievement;
    label: string;
    description: string;
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

export const weapon_achievement_descriptions = new Map<WeaponAchievement, WeaponAchievementDescription>([
    make({
        id: WeaponAchievement.FIRST_DUMMY_KILL,
        label: "An easy Target",
        description: "Kill a target dummy as first kill.",
    }), 
    make({
        id: WeaponAchievement.FIRST_KILL,
        label: "First Kill",
        description: "Kill your first enemy.",
    }), 
    make({
        id: WeaponAchievement.FIRST_10_KILL,
        label: "10 Kills",
        description: "Kill the first 10 enemies.",
    }),
    make({
        id: WeaponAchievement.FIRST_100_KILL,
        label: "100 Kills",
        description: "Kill the first 100 enemies.",
    }),
    make({
        id: WeaponAchievement.FIRST_SWORD_KILL,
        label: "Betrayal",
        description: "Destroy the memory of a past warriar.",
    }),
    make({
        id: WeaponAchievement.TRAVELER,
        label: "Traveler",
        description: "Travel accross 25 tiles.",
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
    }),
]);