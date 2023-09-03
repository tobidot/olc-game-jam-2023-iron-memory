import { KeyName, KeyUpEvent, KeyboardController, MouseButtonName, MouseController, MouseDownEvent, MouseUpEvent, MouseWheelEvent } from "../../library";
import { Vector2D } from "../../library/math";
import { ConvexPolygone } from "../../library/math/ConvexPolygone";
import { Rect } from "../../library/math/Rect";
import { Game } from "../base/Game";
import { Agent } from "../models/Agent";
import { AttackDamage } from "../models/AttackDamage";
import { Hero } from "../models/Hero";
import { BaseController } from "./BaseController";

export class AchievementController extends BaseController implements MouseController {

    public constructor(
        game: Game,
    ) {
        super(game);
    }

    public onMouseWheel(event: MouseWheelEvent): void {
        this.game.view.achievement_view.scroll_offset += event.deltaY;
    }

    
}