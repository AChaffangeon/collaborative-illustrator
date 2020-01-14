import { ActionManager, Action } from "./ActionManager";
import { Canvas } from "../View/Canvas";

export class UpdateColorAction implements Action {
    UserId: string =  ActionManager.UserId;
    color: string;

    constructor(color: string) {
        this.color = color;
    }

    do(canvas: Canvas): void {
        canvas.updateColor(this.color);
    }

    undo(canavs: Canvas): void {

    }
}