import { ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Game } from "../base/Game";
import { WeaponAchievement } from "../consts/WeaponAchievements";
import { Agent, AgentImageName } from "./Agent";
import { AttackAttributes } from "./AttackAttributes";

export class Weapon extends Agent {
    public achievements: Map<WeaponAchievement, number> = new Map();

    public constructor(
        game: Game,
        position: Vector2D,
        images: Map<AgentImageName, ImageAsset>,
    ) {        
        super(game, Rect.fromCenterAndSize(position, new Vector2D(10, 10)), images, false);
        this.is_neutral = true;
    }

    public modifyLightAttack(attack: AttackAttributes): AttackAttributes {
        return attack;
    }

    public modifyHeavyAttack(attack: AttackAttributes): AttackAttributes {
        return attack;
    }
}
