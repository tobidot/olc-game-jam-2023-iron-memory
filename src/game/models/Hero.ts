import { AABBPhysicsProxy, ImageAsset, assert } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Shape } from "../../library/math/Shape";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { SatPhysicsProxy } from "../../library/physics/SatPhysicsEngine";
import { Game } from "../base/Game";
import { WorldMapAreaBorder } from "../consts/Direction";
import { WeaponAchievement } from "../consts/WeaponAchievements";
import { Agent } from "./Agent";
import { AttackAttributes } from "./AttackAttributes";
import { Weapon } from "./Weapon";

export enum AgentImageName {
    DEFAULT,
}

export type AgentImageSet = Map<AgentImageName, ImageAsset>;

export class Hero extends Agent {
    public weapon: Weapon;

    public constructor(
        protected game: Game,
        shape: Shape,
        images: AgentImageSet,
        is_player: boolean,
    ) {
        super(game, shape, images, is_player);
        this.weapon = this.game.model.weapon_factory.makeSword(this.physics.shape.getCenter());
    }

    public update(delta_seconds: number): void {
        super.update(delta_seconds);
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
        const starting_area = this.game.model.world_map.at(
            Math.floor(this.game.model.world_map.size.x / 2),
            Math.floor(this.game.model.world_map.size.y / 2),
        );
        this.game.controller.travelTo(starting_area);
    }

    public onKill(other: Agent) {
        // do nothing
        this.weapon.increase(WeaponAchievement.FIRST_KILL, 1);
        this.weapon.increase(WeaponAchievement.FIRST_10_KILL, 1);
        this.weapon.increase(WeaponAchievement.FIRST_100_KILL, 1);
    }

    public getHeavyAttackStruct(): AttackAttributes {
        return this.weapon.modifyHeavyAttack(this.heavy_attack.cpy());
    }

    public getLightAttackStruct(): AttackAttributes {
        return this.weapon.modifyLightAttack(this.light_attack.cpy());
    }
}