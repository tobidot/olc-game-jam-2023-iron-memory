import { Agent } from "./Agent";
import { AttackDamage } from "./AttackDamage";

export interface AttackDamageModifier {
    physical?: number;
    psy?: number;
    fire?: number;
    ice?: number;
}

export interface AttackModifier {
    damage?: AttackDamageModifier;
    attack_width?: number;
    attack_range?: number;
    cooldown_seconds?: number;
    channel_seconds?: number;
    // on_cast?: null | ((attack: AttackAttributes) => void);
    // on_hit?: null | ((attack: AttackAttributes, target: Agent) => void);
}

export class AttackAttributes {
    constructor(
        public damage: AttackDamage,
        public attack_width: number = 40,
        public attack_range: number = 100,
        public cooldown_seconds: number = 0.3,
        public channel_seconds: number = 0,
        public on_cast: null | ((attack: AttackAttributes) => void) = null,
        public on_hit: null | ((attack: AttackAttributes, target: Agent) => void) = null,
    ) {
    }

    public cpy(): AttackAttributes {
        return new AttackAttributes(this.damage.cpy(), this.attack_width, this.attack_range, this.cooldown_seconds, this.channel_seconds);
    }
}