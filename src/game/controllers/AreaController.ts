import { KeyName, KeyUpEvent, KeyboardController, MouseButtonName, MouseController, MouseDownEvent, MouseUpEvent } from "../../library";
import { Vector2D } from "../../library/math";
import { ConvexPolygone } from "../../library/math/ConvexPolygone";
import { Rect } from "../../library/math/Rect";
import { Game } from "../base/Game";
import { Agent } from "../models/Agent";
import { BaseController } from "./BaseController";

export class AreaController extends BaseController {

    public constructor(
        game: Game,
    ) {
        super(game);
    }

    public onMouseDown(event: MouseDownEvent): void {
        if (this.game.mouse.position.y < 30) {
            // top menu bar
            return;
        }
        const player = this.game.model.walkable_area.hero;
        if (!player) {
            // no player unit
            return;
        }
        const target = this.game.mouse.position;
        const direction = target.cpy().sub(player.physics.shape.getCenter()).normalize();
        if (player.attack_cooldown <= 0) {
            switch (event.button.name) {
                case MouseButtonName.LEFT:
                    return this.lightAttack(player, direction);
                case MouseButtonName.RIGHT:
                    return this.heavyAttack(player, direction);
            }
        }
    }

    public onKeyDown(event: KeyUpEvent): void {
        switch (event.key.name) {
            case KeyName.ArrowUp:
            case KeyName.KeyW:
            // return this.playerMove(new Vector2D(0, -1));
            case KeyName.ArrowDown:
            case KeyName.KeyS:
            // return this.playerMove(new Vector2D(0, 1));
            case KeyName.ArrowLeft:
            case KeyName.KeyA:
            // return this.playerMove(new Vector2D(-1, 0));
            case KeyName.ArrowRight:
            case KeyName.KeyD:
                return this.playerUpdateMovement();
        }
        super.onKeyUp(event);
    }

    public onKeyUp(event: KeyUpEvent): void {
        switch (event.key.name) {
            case KeyName.ArrowUp:
            case KeyName.KeyW:
            case KeyName.ArrowDown:
            case KeyName.KeyS:
            case KeyName.ArrowLeft:
            case KeyName.KeyA:
            case KeyName.ArrowRight:
            case KeyName.KeyD:
                return this.playerUpdateMovement();
        }
        super.onKeyUp(event);
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
        if (!player) {
            return;
        }
        player.physics.velocity = direction.normalize().mul(100);
    }

    public lightAttack(player: Agent, direction: Vector2D): void {
        player.attack_cooldown = player.light_attack_delay;
        const attack_width = 30;
        const attack_range = 200;
        const player_center = player.physics.shape.getCenter();
        // const attack_area = Rect.fromCenterAndSize(player_center.cpy().add(direction.cpy().mul(attack_range / 2)), { x: attack_width, y: attack_range });
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
        const effect = this.game.model.effect_factory.makeSlash(player_center.cpy(), attack_width, attack_range, direction);
        this.game.model.walkable_area.entities.push(effect);
        const enemies = this.game.model.walkable_area.physics.pickOverlapping(attack_shape)
            .map((proxy) => proxy.reference)
            .filter((entity) : entity is Agent => entity instanceof Agent && !entity.is_player);
        enemies.forEach((enemy) => {
            enemy.hitpoints -= 10;
            if (enemy.hitpoints <= 0) {
                enemy.is_dead = true;
            }
        });
    }

    public heavyAttack(player: Agent, direction: Vector2D): void {
        player.attack_cooldown = player.light_attack_delay;
        const attack_area = player.physics.shape.getOuterBox().cpy();
        attack_area.center.add(direction.normalize().mul(20));
        attack_area.width = 30;
        attack_area.height = 30;
        
        const enemies = this.game.model.walkable_area.physics.pickOverlapping(attack_area)
            .map((proxy) => proxy.reference)
            .filter((entity) : entity is Agent => entity instanceof Agent && !entity.is_player);
        enemies.forEach((enemy) => {
            enemy.hitpoints -= 10;
            if (enemy.hitpoints <= 0) {
                enemy.is_dead = true;
            }
        });
    }
}