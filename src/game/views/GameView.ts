import { GameModel } from "../models/GameModel";
import { View } from "../../library/abstract/mvc/View";
import { GameBaseView } from "../../library";

export class GameView extends GameBaseView implements View {

    public constructor(
        public context: CanvasRenderingContext2D,
    ) {
        super(context);
        this.resetCanvasState();
    }

    public update(delta_ms: number) : void{
        // do nothing
    }

    public render(model: GameModel): void {
        super.render(model);
    }
}