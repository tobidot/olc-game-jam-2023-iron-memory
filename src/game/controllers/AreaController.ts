import { KeyName, KeyUpEvent, KeyboardController, MouseButtonName, MouseController, MouseDownEvent, MouseUpEvent } from "../../library";
import { Vector2D } from "../../library/math";
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
        const player = this.game.model.walkable_area.player;
        if (!player) {
            // no player unit
            return;
        }
        const target = this.game.mouse.position;
        const direction = target.sub(player.physics.shape.getCenter());
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
        const player = this.game.model.walkable_area.player;
        if (!player) {
            return;
        }
        player.physics.velocity = direction.normalize().mul(100);
    }

    public lightAttack(player: Agent, direction: Vector2D): void {
        player.attack_cooldown = player.light_attack_delay;
        const attack_area = player.physics.shape.getOuterBox().cpy();
        attack_area.center.add(direction.normalize().mul(20));
        attack_area.width = 20;
        attack_area.height = 20;
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