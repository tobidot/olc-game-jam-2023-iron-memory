import { Agent } from "./Agent";

export class AttackDamage {
    constructor(
        public readonly source: Agent,
        public physical: number = 10,
        public psy: number = 0,
        public fire: number = 0,
        public ice: number = 0,
    ) {
    }

    public cpy(): AttackDamage {
        return new AttackDamage(this.source, this.physical, this.psy, this.fire, this.ice);
    }
}