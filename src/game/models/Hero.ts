import { AABBPhysicsProxy, ImageAsset, assert } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Shape } from "../../library/math/Shape";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { SatPhysicsProxy } from "../../library/physics/SatPhysicsEngine";
import { Game } from "../base/Game";
import { WorldMapAreaBorder } from "../consts/Direction";
import { EnemyType } from "../consts/EnemyType";
import { ViewName } from "../consts/ViewName";
import { WeaponAchievement } from "../consts/WeaponAchievements";
import { Agent } from "./Agent";
import { AiAgent } from "./AiAgent";
import { AttackAttributes } from "./AttackAttributes";
import { Info } from "./Info";
import { Potion } from "./Potion";
import { Weapon } from "./Weapon";

export enum AgentImageName {
    DEFAULT,
}

export type AgentImageSet = Map<AgentImageName, ImageAsset>;

export class Hero extends Agent {
    public weapon: Weapon;
    public age: number = 16;

    public constructor(
        protected game: Game,
        shape: Shape,
        images: AgentImageSet,
        is_player: boolean,
    ) {
        super(game, shape, images, is_player);
        this.weapon = this.game.model.weapon_factory.makeSword(this.physics.shape.getCenter());
        this.weapon.hero = this;
    }

    public update(delta_seconds: number): void {
        super.update(delta_seconds);
        this.movement_speed = this.age < 25
            ? 250
            : this.age < 60
                ? 225
                : this.age < 80
                    ? 200
                    : this.age < 90 ? 185 : 170;
        if (this.game.model.active_view === ViewName.AREA) {
            this.age += delta_seconds * 1.5;
            if (this.age > 100) {
                this.age = 100;
                this.hitpoints = 0;
                this.is_dead = true;
                this.onDeath();
            }
        }
    }

    public onWorldCollision(distance: Vector2D): void {
        // do nothing
        const border = ((): WorldMapAreaBorder => {
            if (distance.x > 0) {
                return WorldMapAreaBorder.EAST;
            } else if (distance.x < 0) {
                return WorldMapAreaBorder.WEST;
            } else if (distance.y > 0) {
                return WorldMapAreaBorder.SOUTH;
            } else {
                return WorldMapAreaBorder.NORTH;
            }
        })();
        this.game.controller.travel(border);
    }

    public onCollision(other: PhysicsProxy, collision: Collision): void {
        // do nothing
    }

    public onDeath() {
        this.game.model.resetAfterDeath();
        const current_area = this.game.model.world_map.at(
            this.game.model.world_map.active_area_coordinate.x,
            this.game.model.world_map.active_area_coordinate.y,
        );
        // drop the weapon here
        this.weapon.increase(WeaponAchievement.SOUL, 1);
        current_area.entities.push(this.weapon);
        this.weapon.physics.shape.setCenter(this.physics.shape.getCenter());
        // move to the starting area
        const starting_area = this.game.model.world_map.getStartingArea();
        this.game.controller.travelTo(starting_area);
    }

    public onKill(other: Agent) {
        // check for achievements
        if (other instanceof AiAgent) {
            this.weapon.increase(WeaponAchievement.FIRST_KILL, 1);
            this.weapon.increase(WeaponAchievement.FIRST_10_KILL, 1);
            this.weapon.increase(WeaponAchievement.FIRST_100_KILL, 1);
        }
        if (other instanceof Potion) {
            this.weapon.increase(WeaponAchievement.FIRST_HEAL, 1);
            this.weapon.increase(WeaponAchievement.FIRST_5_HEAL, 1);
            this.weapon.increase(WeaponAchievement.FIRST_10_HEAL, 1);
            this.weapon.increase(WeaponAchievement.FIRST_50_HEAL, 1);
            this.weapon.increase(WeaponAchievement.FIRST_100_HEAL, 1);
        }
        if (other instanceof Info) {
            this.weapon.increase(WeaponAchievement.FIRST_SIGN_KILL, 1);
        }
        if (other instanceof Weapon) {
            this.weapon.increase(WeaponAchievement.FIRST_SWORD_KILL, 1);
            this.weapon.increase(WeaponAchievement.FIRST_5_SWORD_KILL, 1);
        }
        if (other instanceof AiAgent) {
            switch (other.type) {
                case EnemyType.GOBLIN:
                    this.weapon.increase(WeaponAchievement.FIRST_10_GOBLIN_KILL, 1);
                    this.weapon.increase(WeaponAchievement.FIRST_50_GOBLIN_KILL, 1);
                    this.weapon.increase(WeaponAchievement.FIRST_100_GOBLIN_KILL, 1);
                    break;
                case EnemyType.SPIDER:
                    this.weapon.increase(WeaponAchievement.FIRST_10_SPIDER_KILL, 1);
                    this.weapon.increase(WeaponAchievement.FIRST_50_SPIDER_KILL, 1);
                    this.weapon.increase(WeaponAchievement.FIRST_100_SPIDER_KILL, 1);
                    break;
                case EnemyType.IMP:
                    this.weapon.increase(WeaponAchievement.FIRST_10_IMP_KILL, 1);
                    this.weapon.increase(WeaponAchievement.FIRST_50_IMP_KILL, 1);
                    this.weapon.increase(WeaponAchievement.FIRST_100_IMP_KILL, 1);
                    break;
                case EnemyType.HOB_GOBLIN:
                    this.weapon.increase(WeaponAchievement.HOB_GOBLIN_KILL, 1);
                    break;
                case EnemyType.ORC:
                    this.weapon.increase(WeaponAchievement.ORC_KILL, 1);
                    break;
                case EnemyType.TROLL:
                    this.weapon.increase(WeaponAchievement.TROLL_KILL, 1);
                    break;
                case EnemyType.DRAGON:
                    this.weapon.increase(WeaponAchievement.DRAGON_KILL, 1);
                    break;
                case EnemyType.DEMON:
                    this.weapon.increase(WeaponAchievement.DEMON_KILL, 1);
                    break;
                case EnemyType.LICH:
                    this.weapon.increase(WeaponAchievement.LICH_KILL, 1);
                    break;
            }
            if ([EnemyType.HOB_GOBLIN, EnemyType.ORC, EnemyType.TROLL, EnemyType.DRAGON, EnemyType.DEMON, EnemyType.LICH].includes(other.type)) {
                this.weapon.increase(WeaponAchievement.FIRST_BOSS_KILL, 1);
            }
        }

    }

    public getHeavyAttackStruct(): AttackAttributes {
        const attack = this.weapon.modifyHeavyAttack(this.heavy_attack.cpy());
        attack.damage.physical *= this.age / 25;
        // attack.cooldown_seconds += this.age / 100;
        return attack;
    }

    public getLightAttackStruct(): AttackAttributes {
        const attack = this.weapon.modifyLightAttack(this.light_attack.cpy());
        attack.damage.physical *= this.age / 25;
        // attack.cooldown_seconds += this.age / 100;
        return attack;
    }
}