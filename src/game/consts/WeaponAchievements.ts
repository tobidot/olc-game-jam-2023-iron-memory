export enum WeaponAchievement {
    FIRST_DUMMY_KILL,
    VETERAN,
    SOUL,
}

export interface WeaponAchievementDescription {
    id: WeaponAchievement;
    label: string;
    description: string;
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