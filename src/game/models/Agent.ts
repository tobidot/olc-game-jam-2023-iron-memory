import { AABBPhysicsProxy, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Shape } from "../../library/math/Shape";
import { Collision, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { SatPhysicsProxy } from "../../library/physics/SatPhysicsEngine";
import { Game } from "../base/Game";
import { AttackAttributes } from "./AttackAttributes";
import { AttackDamage } from "./AttackDamage";
import { Entity } from "./Entity";
import { Physical } from "./Physical";

export enum AgentImageName {
    DEFAULT,
}

export type AgentImageSet = Map<AgentImageName, ImageAsset>;

export interface ChannelAction {
    delay_seconds: number;
    callback: (agent: Agent) => void;
}

export class Agent extends Entity implements PhysicsProxiable, Physical {
    // 'static' game properties
    public is_dead: boolean = false;
    public is_player: boolean = false;
    public is_neutral: boolean = false;
    // game variables
    // base stats
    public max_hitpoints: number = 100;
    public movement_speed: number = 100;
    // attributes
    public hitpoints: number = 100;
    public physical_resistance: number = 0;
    public psy_resistance: number = 0;
    public ice_resistance: number = 0;
    public fire_resistance: number = 0;
    // attack
    public light_attack: AttackAttributes = new AttackAttributes(new AttackDamage(this));
    public heavy_attack: AttackAttributes = new AttackAttributes(new AttackDamage(this));
    public special_attack_1: AttackAttributes = new AttackAttributes(new AttackDamage(this));
    public special_attack_2: AttackAttributes = new AttackAttributes(new AttackDamage(this));
    public special_attack_3: AttackAttributes = new AttackAttributes(new AttackDamage(this));
    public cooldown: number = 0;
    public channel: null | ChannelAction = null;
    // physics properties
    public physics: SatPhysicsProxy;
    public physics_id: number | null = null;
    // rendering properties
    public images: AgentImageSet;
    public render_box: Rect;
    // 

    public constructor(
        protected game: Game,
        shape: Shape,
        images: AgentImageSet,
        is_player: boolean,
    ) {
        super();
        this.is_player = is_player;
        this.images = images;
        this.render_box = shape.getOuterBox();
        this.physics = new SatPhysicsProxy(
            this,
            shape,
        );
    }

    public update(delta_seconds: number): void {
        this.render_box.center.set(this.physics.shape.getCenter());
        this.cooldown = Math.max(0, this.cooldown - delta_seconds);
        if (this.channel !== null) {
            this.channel.delay_seconds -= delta_seconds;
            if (this.channel.delay_seconds <= 0) {
                this.channel.callback(this);
                this.channel = null;
            }
        }
    }

    public getLightAttackStruct(): AttackAttributes {
        return this.light_attack;
    }

    public getHeavyAttackStruct(): AttackAttributes {
        return this.heavy_attack;
    }

    public onWorldCollision(distance: Vector2D): void {
        // do nothing
    }

    public onCollision(other: PhysicsProxy, collision: Collision): void {
        // do nothing
    }

    public applyDamage(damage: AttackDamage) {
        const physical = Math.max(damage.physical * Math.random() - Math.sqrt(Math.max(0, this.physical_resistance)), 0) * (100 / (100 + this.physical_resistance));
        const psy = Math.max(damage.psy * Math.random() - Math.sqrt(Math.max(0, this.psy_resistance)), 0) * (100 / (100 + this.psy_resistance));
        const ice = Math.max(damage.ice * Math.random() - Math.sqrt(Math.max(0, this.ice_resistance)), 0) * (100 / (100 + this.ice_resistance));
        const fire = Math.max(damage.fire * Math.random() - Math.sqrt(Math.max(0, this.fire_resistance)), 0) * (100 / (100 + this.fire_resistance));
        const total = physical + psy + ice + fire;
        this.hitpoints -= total;

        // display damage for all damage types
        const types = [physical, psy, ice, fire];
        const colors = ["white", "hotpink", "aqua", "orange"];
        types.map((damage, index) => {
            if (damage > 0 || index === 0) {
                const position = this.physics.shape.getCenter().cpy().add(new Vector2D(index * 30, -20));
                const effect = this.game.model.effect_factory.makeDamageText(
                    position,
                    damage.toFixed(0),
                    colors[index],
                );
                this.game.model.walkable_area.addEntity(effect);
                return true;
            }
            return false;
        });

        if (this.hitpoints <= 0) {
            this.is_dead = true;
            this.onDeath();
            damage.source.onKill(this);
        }
    }

    public onDeath() {

    }

    public onKill(other: Agent) {

    }

}