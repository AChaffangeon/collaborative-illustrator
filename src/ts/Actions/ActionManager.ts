import { Canvas } from "../View/Canvas";
import { EventManager } from "../Events/EventManager";
import { ShapeCreatedEvent } from "../Events/ShapeCreatedEvent";
import { StrokeChangedEvent } from "../Events/StrokeChangedEvent";
import { StrokeWidthChangedEvent } from "../Events/StrokeWidthChangedEvent";
import { FillChangedEvent } from "../Events/FillChangedEvent";
import { TranslateShapeEvent } from "../Events/TranslateShapeEvent";
import { DeleteShapeEvent } from "../Events/DeleteShapeEvent";
import { SelectShapeEvent } from "../Events/SelectShapeEvent";

/** Id of an Action. */
export type ActionID = string;

/** Interface for Actions. */
export interface Action { type: string; userId: ActionID; objectId: string; timeStamp: number; do: (canvas: Canvas) => void; undo: (canvas: Canvas) => void; }

/** A class to manage and apply actions on a Canvas. */
export class ActionManager {
    static userId: string = `User_${Math.floor(Date.now() + Math.random())}`;
    static timeStamp: number = 0;
    static createdShapes: string[] = [];
    static deletedShapes: string[] = [];
    canvas: Canvas;
    doneActions: Action[];
    undoneActions: Action[];
    queueActions: Action[];

    constructor(canvas: Canvas) {

        this.canvas = canvas;
        this.doneActions = [];
        this.undoneActions = [];
        this.queueActions = [];
        this.setupEventListeners();
        this.setupCrtlZListeners();
    }

    do(action: Action): void {
        action.do(this.canvas);
    }

    undo(action: Action): void {
        action.undo(this.canvas);
    }

    rankActions(a: Action, b: Action): number {

        let uIdNumA = parseFloat(a.userId.replace(/[^0-9]/g, ""));
        let uIdNumB = parseFloat(b.userId.replace(/[^0-9]/g, ""));

        if (a.timeStamp < b.timeStamp) {
            return -1;
        }else if (a.timeStamp === b.timeStamp && uIdNumA < uIdNumB) {
            return -1;
        }else {
            return 1;
        }
    }

    manageActions(action: Action): void {
        if (ActionManager.deletedShapes.includes(action.objectId)) {
            return;
        } else if (!ActionManager.createdShapes.includes(action.objectId)) {
            if (action.type === "addShape") {
                this.doneActions.push(action);
                this.do(action);

                for (let a of this.queueActions) {
                    if (a.objectId === action.objectId) {
                        this.doneActions.push(a);
                        this.do(a);
                        this.queueActions.splice(this.queueActions.indexOf(a), 1);
                    }
                }

            } else {
                this.queueActions.push(action);
            }
        } else if (action.timeStamp !== ActionManager.timeStamp) {
            this.promote(action);

        } else {
            this.doneActions.push(action);
            this.do(action);
        }

        this.update(action);
    }

    promote(action: Action): void {
        let concurrentActions = [];

        for (let a of this.doneActions) {
            if (this.rankActions(action, a) < 0 && action.type === a.type) {
                concurrentActions.push(a);
            }
        }

        concurrentActions.reverse();
        for (let a of concurrentActions) {
            this.undo(a);
        }

        this.doneActions.push(action);
        this.do(action);

        concurrentActions.reverse();
        for (let a of concurrentActions) {
            this.do(a);
        }
    }

    update(action: Action): void {
        ActionManager.timeStamp = Math.max(ActionManager.timeStamp, action.timeStamp);
     }

    setupEventListeners(): void {
        EventManager.registerHandler("shapeCreated", (e: ShapeCreatedEvent) => {
            this.manageActions(e.action);
        });

        EventManager.registerHandler("strokeChanged", (e: StrokeChangedEvent) => {
            this.manageActions(e.action);
        });

        EventManager.registerHandler("strokeWidthChanged", (e: StrokeWidthChangedEvent) => {
            this.manageActions(e.action);
        });

        EventManager.registerHandler("fillChanged", (e: FillChangedEvent) => {
            this.manageActions(e.action);
        });

        EventManager.registerHandler("translateShape", (e: TranslateShapeEvent) => {
            this.manageActions(e.action);
        });

        EventManager.registerHandler("shapeDeleted", (e: DeleteShapeEvent) => {
            this.manageActions(e.action);
        });

        EventManager.registerHandler("selectShape", (e: SelectShapeEvent) => {
            this.manageActions(e.action);
        });

        EventManager.registerHandler("unselectShape", (e: SelectShapeEvent) => {
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
        ActionManager.timeStamp += 1;
        return ActionManager.timeStamp;
    }
}
