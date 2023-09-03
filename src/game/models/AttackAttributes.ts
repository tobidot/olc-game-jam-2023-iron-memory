import { AttackDamage } from "./AttackDamage";

export class AttackAttributes {
    constructor(
        public damage: AttackDamage,
        public attack_width: number = 40,
        public attack_range: number = 100,
        public cooldown_seconds: number = 0.3,
        public channel_seconds: number = 0,
    ) {
    }

    public cpy(): AttackAttributes {
        return new AttackAttributes(this.damage.cpy(), this.attack_width, this.attack_range, this.cooldown_seconds, this.channel_seconds);
    }
}