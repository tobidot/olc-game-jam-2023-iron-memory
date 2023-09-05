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
        const player = this.game.model.walkable_area.hero;
        if (!player) {
            return;
        }
        const max_scroll = Math.max(0, this.game.model.achievement_screen_height - 400);
        this.game.view.achievement_view.scroll_offset = Math.max(
            0,
            Math.min(
                max_scroll, 
                this.game.view.achievement_view.scroll_offset + event.deltaY
            )
        );
    }


}