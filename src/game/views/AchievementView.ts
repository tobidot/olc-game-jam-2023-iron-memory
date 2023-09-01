import { GameModel } from "../models/GameModel";
import { ViewSettings } from "../../library/abstract/mvc/View";

export class AchievementView {

    public constructor(
        public context: CanvasRenderingContext2D,
        public settings: ViewSettings,
    ) {
    }

    public update(delta_ms: number): void {
        // do nothing
    }

    /**
     * Render the complete game state
     * @param model 
     */
    public render(model: GameModel): void {

    }
}