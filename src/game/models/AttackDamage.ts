import { Agent } from "./Agent";

export class AttackDamage {
    constructor(
        public readonly source: Agent,
        public readonly physical: number = 10,
        public readonly psy: number = 0,
        public readonly fire: number = 0,
        public readonly ice: number = 0,
    ) {
    }
}