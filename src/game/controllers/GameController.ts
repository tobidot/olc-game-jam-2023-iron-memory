import { KeyName, KeyUpEvent, MenuModel, MouseUpEvent, assert } from "../../library";
import { ControllerResponse } from "../../library/abstract/mvc/Response";
import { Vector2D } from "../../library/math";
import { Circle } from "../../library/math/Circle";
import { ConvexPolygone } from "../../library/math/ConvexPolygone";
import { Game } from "../base/Game";
import { WorldMapAreaBorder } from "../consts/Direction";
import { MenuButtonName } from "../consts/MenuButtonName";
import { ViewName } from "../consts/ViewName";
import { WeaponAchievement } from "../consts/WeaponAchievements";
import { Agent } from "../models/Agent";
import { AttackAttributes } from "../models/AttackAttributes";
import { AttackDamage } from "../models/AttackDamage";
import { Hero } from "../models/Hero";
import { Weapon } from "../models/Weapon";
import { WorldMapArea } from "../models/WorldMap";
import { BaseController } from "./BaseController";

export class GameController extends BaseController {

    public constructor(
        game: Game,
    ) {
        super(game);
    }

    /**
     * Start a new game
     */
    public newGame(): ControllerResponse {
        this.game.model.reset();
        const starting_area = this.game.model.world_map.at(
            this.game.model.world_map.active_area_coordinate.x,
            this.game.model.world_map.active_area_coordinate.y
        );
        this.travelTo(starting_area);
        return null;
    }

    public isGameOver(): boolean {
        return false;
    }

    public update(delta_seconds: number): ControllerResponse {
        this.game.model.update(delta_seconds);
        return null;
    }

    /**
     * Any button has been clicked
     * @param item 
     */
    public onMenuSelect(item: MenuModel): void {
        console.log("Menu item selected: " + item.name);
        switch (item.name) {
            // top menu bar
            case MenuButtonName.ACHIEVEMENTS: this.switchView(ViewName.ACHIEVEMENTS); break;
            case MenuButtonName.INVENTORY: this.switchView(ViewName.INVENTORY); break;
            case MenuButtonName.WORLD_MAP: this.switchView(ViewName.WORLD_MAP); break;
            case MenuButtonName.MAIN_MENU: this.switchView(ViewName.MAIN_MENU); break;
            case MenuButtonName.GAME: this.switchView(ViewName.AREA); break;
            case MenuButtonName.NEW_GAME: this.newGame(); break;
            default: console.log("Unknown menu item selected: " + item.name); break;
        }
    }

    /**
     * Pass to another area in the map
     * @param border 
     */
    public travel(border: WorldMapAreaBorder) {
        const player = this.game.model.walkable_area.hero;
        assert(!!player, "No player unit");
        // do nothing if border is closed
        const active_coordinates = this.game.model.world_map.active_area_coordinate;
        console.log(active_coordinates);
        const old_area = this.game.model.world_map.at(
            active_coordinates.x,
            active_coordinates.y
        );
        const border_state = old_area.open_borders.get(border);
        if (border_state !== true) {
            // border is closed
            return;
        }
        // travel to next area        
        const next_area_position = this.game.model.world_map.getBorderPosition(active_coordinates, border);
        const new_area = this.game.model.world_map.at(next_area_position.x, next_area_position.y);
        this.travelTo(new_area, {
            [WorldMapAreaBorder.EAST]: WorldMapAreaBorder.WEST,
            [WorldMapAreaBorder.WEST]: WorldMapAreaBorder.EAST,
            [WorldMapAreaBorder.NORTH]: WorldMapAreaBorder.SOUTH,
            [WorldMapAreaBorder.SOUTH]: WorldMapAreaBorder.NORTH,
        }[border]);
    }

    public travelTo(
        new_area: WorldMapArea,
        from: WorldMapAreaBorder | null = null,
    ) {
        const player = this.game.model.walkable_area.hero;
        assert(!!player, "No player unit");

        // 
        player.weapon.increase(WeaponAchievement.TRAVELER, 1);
        // reset the walkable area
        const walkable_area = this.game.model.walkable_area;
        // reset the player position to the opposie border of where he just traveld to
        if (from === null) {
            player.physics.shape.setCenter(walkable_area.area.center);
        } else {
            const offset = this.game.model.world_map.getBorderOffset(from);
            const player_box = player.physics.shape.getOuterBox();
            const new_position = new Vector2D(
                offset.x * (walkable_area.area.size.x / 2 - player_box.width - 10) + walkable_area.area.center.x,
                offset.y * (walkable_area.area.size.y / 2 - player_box.height - 10) + walkable_area.area.center.y,
            );
            player.physics.shape.setCenter(new_position);
        }
        // update world position and discover new areas
        this.game.model.world_map.active_area_coordinate.set(new_area.position);
        new_area.open_borders.forEach((is_open, border) => {
            if (!is_open) {
                return;
            }
            const position = this.game.model.world_map.getBorderPosition(new_area.position, border);
            const area = this.game.model.world_map.at(position.x, position.y);
            area.discovered = true;
        });


        // reset the walkable area
        walkable_area.clear();
        walkable_area.addEntity(walkable_area.hero = player);
        new_area.entities.forEach((entity) => {
            if (entity instanceof Agent && entity.is_dead) {
                return;
            }
            walkable_area.addEntity(entity);
        });
        console.log(new_area, walkable_area);
    }

    public playerUpdateMovement(): void {
        const keys: Array<[KeyName, Vector2D]> = [
            [KeyName.ArrowUp, Vector2D.UP],
            [KeyName.KeyW, Vector2D.UP],
            [KeyName.ArrowDown, Vector2D.DOWN],
            [KeyName.KeyS, Vector2D.DOWN],
            [KeyName.ArrowLeft, Vector2D.LEFT],
            [KeyName.KeyA, Vector2D.LEFT],
            [KeyName.ArrowRight, Vector2D.RIGHT],
            [KeyName.KeyD, Vector2D.RIGHT],
        ];
        const movement = keys.map(([key, direction]) => {
            if (this.game.keyboard.getKey(key).is_down) {
                return direction;
            }
            return new Vector2D(0, 0);
        }).reduce((sum: Vector2D, next: Vector2D): Vector2D => {
            return sum.add(next);
        }, new Vector2D(0, 0))
        this.playerMove(movement);
    }

    public playerMove(direction: Vector2D) {
        const player = this.game.model.walkable_area.hero;
        if (!player || player.channel !== null) {
            return;
        }
        player.physics.velocity = direction.normalize().mul(player.movement_speed);
    }

    public lightAttack(agent: Agent, direction: Vector2D): void {
        this.attack(
            agent,
            direction,
            agent.getLightAttackStruct(),
        );
    }

    public heavyAttack(agent: Agent, direction: Vector2D): void {
        this.attack(
            agent,
            direction,
            agent.getHeavyAttackStruct(),
        );
    }

    public attack(
        agent: Agent,
        direction: Vector2D,
        attack: AttackAttributes,
    ) {
        const { channel_seconds, attack_width, attack_range, damage, cooldown_seconds } = attack;
        if (agent.channel !== null || agent.cooldown > 0) {
            // still channeling
            return;
        }
        if (channel_seconds > 0) {
            agent.physics.velocity.set({ x: 0, y: 0 });
            agent.channel = {
                delay_seconds: channel_seconds,
                callback: this.getAttackCallback(agent, direction, attack_width, attack_range, damage, cooldown_seconds),
            };
        } else {
            this.getAttackCallback(agent, direction, attack_width, attack_range, damage, cooldown_seconds)(agent);
        }
    }

    public getAttackCallback(
        source: Agent,
        direction: Vector2D,
        attack_width: number,
        attack_range: number,
        damage: AttackDamage,
        cooldown: number,
    ) {
        return (agent: Agent) => {
            if (agent.is_dead) {
                return;
            }
            // set the cooldown
            source.cooldown = cooldown;

            // add the visual effect
            const player_center = source.physics.shape.getCenter();
            const effect = this.game.model.effect_factory
                .makeSlash(player_center.cpy(), attack_width, attack_range, direction);
            this.game.model.walkable_area.entities.push(effect);

            // apply damage to enemies
            const direction_left = direction.cpy().rotate(Math.PI / 2).normalize();
            const direction_right = direction.cpy().rotate(-Math.PI / 2).normalize();
            const forward = direction.cpy().mul(attack_range);
            const left = direction_left.cpy().mul(attack_width / 2);
            const right = direction_right.cpy().mul(attack_width / 2);
            const attack_shape = new ConvexPolygone([
                player_center.cpy().add(left),
                player_center.cpy().add(forward).add(left),
                player_center.cpy().add(forward).add(right),
                player_center.cpy().add(right),
            ]);
            // pick enemies in area
            const enemies = this.game.model.walkable_area.physics.pickOverlapping(attack_shape)
                .map((proxy) => proxy.reference)
                .filter((entity): entity is Agent => entity instanceof Agent && entity.is_player !== agent.is_player);
            enemies.forEach((enemy) => {
                enemy.applyDamage(damage);
            });

            this.playerUpdateMovement();
        }
    }

    public swapWeapon() {
        const player = this.game.model.walkable_area.hero;
        if (!player) {
            return;
        }
        const old_weapon = player.weapon;
        const current_area = this.game.model.walkable_area;
        const entities_in_range = current_area.physics.pickOverlapping(new Circle(player.physics.shape.getCenter(), 80));
        const weapons = entities_in_range
            .map((proxy) => proxy.reference)
            .filter((entity): entity is Weapon => entity instanceof Weapon);
        if (weapons.length <= 0) {
            console.log('no weapons in range');
            return;
        }
        const new_weapon = weapons[0];
        // swap weapons
        player.weapon = new_weapon;
        current_area.removeEntity(new_weapon);
        current_area.addEntity(old_weapon);
        old_weapon.physics.shape.setCenter(player.physics.shape.getCenter());
    }

}