import { Canvas } from "../View/Canvas";
import { EventManager } from "../Events/EventManager";
import { ShapeCreatedEvent } from "../Events/ShapeCreatedEvent";

/** Id of an Action. */
export type ActionID = string;

/** Interface for Actions. */
export interface Action { UserId: ActionID; do: (canvas: Canvas) => void; undo: (canvas: Canvas) => void; }

/** A class to manage and apply actions on a Canvas. */
export class ActionManager {
    static UserId: string = `User_${Date.now() + Math.random()}`;
    canvas: Canvas;
    timeStamp: number;
    actions: Action [];

    constructor(canvas: Canvas) { 
        this.canvas = canvas;
        this.timeStamp = 0;
        this.actions = [];
        this.setupEventListeners();
    }

    do(action: Action): void {
        action.do(this.canvas);
    }

    undo(action: Action): void {
        action.undo(this.canvas);
    }

    manageActions(action: Action): void {
        console.log(action);
        this.do(action);
    }

    setupEventListeners(): void {
        EventManager.registerHandler("shapeCreated", (e: ShapeCreatedEvent) => {
            this.manageActions(e.action);
        });

        EventManager.registerHandler("colorChanged", (e: ShapeCreatedEvent) => {
            this.manageActions(e.action);
        });
    }
}