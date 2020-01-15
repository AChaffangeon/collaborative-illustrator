import { Canvas } from "../View/Canvas";
import { EventManager } from "../Events/EventManager";
import { ShapeCreatedEvent } from "../Events/ShapeCreatedEvent";

/** Id of an Action. */
export type ActionID = string;

/** Interface for Actions. */
export interface Action { UserId: ActionID; timeStamp: number; do: (canvas: Canvas) => void; undo: (canvas: Canvas) => void; }

/** A class to manage and apply actions on a Canvas. */
export class ActionManager {
    static UserId: string = `User_${Date.now() + Math.random()}`;
    static timeStamp: number = 0;
    canvas: Canvas;
    doneActions: Action[];
    undoneActions: Action[];

    constructor(canvas: Canvas) { 
        this.canvas = canvas;
        this.doneActions = [];
        this.undoneActions = [];
        this.setupEventListeners();
        this.setupCrtlZListeners();
    }

    do(action: Action): void {
        action.do(this.canvas);
    }

    undo(action: Action): void {
        action.undo(this.canvas);
    }

    manageActions(action: Action): void {
        console.log(action);
        this.doneActions.push(action);
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

    setupCrtlZListeners(): void {
        document.addEventListener('keypress', (e) => {
            if (e.key === "z" && e.ctrlKey) {
                let action = this.doneActions.pop();
                if (action) {
                    action.undo(this.canvas);
                    this.undoneActions.push(action);
                }
            }
            if (e.key === "Z" && e.ctrlKey && e.shiftKey) {
                let action = this.undoneActions.pop();
                if (action) {
                    action.do(this.canvas);
                    this.doneActions.push(action);
                }
            }
        });
    }

    static getTimeStamp(): number {
        let t = ActionManager.timeStamp;
        ActionManager.timeStamp += 1;
        return t;
    }
}