export enum StoryFlag {
    INTRODUCTION,
    FIRST_DEATH,
}

export interface StoryFlagDescription {
    id: StoryFlag;
    label: string;
    description: string;
    progress: number;
    achievement: boolean;
}

function make(
    description: Partial<StoryFlagDescription>
        & Omit<StoryFlagDescription, "progress" | "achievement">
): [StoryFlag, StoryFlagDescription] {
    return [
        description.id,
        Object.assign({
            progress: 0,
            achievement: false,
        }, description)
    ];
}

export const story_flag_descriptions = new Map<StoryFlag, StoryFlagDescription>([
    make({
        id: StoryFlag.INTRODUCTION,
        label: "Introduction",
        description: "Stay a while and listen...",
    }),
    make({
        id: StoryFlag.FIRST_DEATH,
        label: "First Death",
        description: "You died for the first time.",
        achievement: true,
    }),
]);