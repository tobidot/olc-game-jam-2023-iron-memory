import { KeyName, KeyUpEvent, KeyboardController, MouseButtonName, MouseController, MouseDownEvent, MouseUpEvent } from "../../library";
import { Vector2D } from "../../library/math";
import { ConvexPolygone } from "../../library/math/ConvexPolygone";
import { Rect } from "../../library/math/Rect";
import { Game } from "../base/Game";
import { Agent } from "../models/Agent";
import { AttackDamage } from "../models/AttackDamage";
import { Hero } from "../models/Hero";
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
        switch (event.button.name) {
            case MouseButtonName.LEFT:
                return this.game.controller.lightAttack(player, direction);
            case MouseButtonName.RIGHT:
                return this.game.controller.heavyAttack(player, direction);
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
                return this.game.controller.playerUpdateMovement();
                case KeyName.Space:
                    this.game.controller.swapWeapon();
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
                return this.game.controller.playerUpdateMovement();
        }
        super.onKeyUp(event);
    }

    
}