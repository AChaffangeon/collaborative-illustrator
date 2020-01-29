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
    /** Id of the user. */
    static userId: string = "";
    /** Current value of the clock. */
    static timeStamp: number = 0;
    /** List of created shapes. */
    static createdShapes: string[] = [];
    /** List of deleted shapes. */
    static deletedShapes: string[] = [];
    /** associate each peer connected to the last timestamp he sended */
    static lastPeerTimeStamps: [string, number][] = [];
    /** Canvas where to apply Actions. */
    canvas: Canvas;
    /** List of done actions. */
    doneActions: Action[];
    /** List of undone actions. */
    undoneActions: Action[];
    /** List of actions, applied to a shape that doesn't allready exist. */
    queueActions: Action[];


    constructor(canvas: Canvas) {

        this.canvas = canvas;
        this.doneActions = [];
        this.undoneActions = [];
        this.queueActions = [];
        this.setupEventListeners();
    }

    do(action: Action): void {
        action.do(this.canvas);
    }

    undo(action: Action): void {
        action.undo(this.canvas);
    }

    /**
     * Returns -1 if the action a has a timeStamp below the b action or if it's id is below, if not return 1.
     * @param a first action that will be compared.
     * @param b second action that will be compared.
     */
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

    /**
     * Manage the execution an action that has been received and add it to the doneAction list
     * if the first action is executed on a not existing shape, add it to the queue list
     * if an action is in concurrency with a previous one, execute the "promote" function
     * @param action action that just arrived and hasn't been processed yet
     */

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

    /**
     * Manage a problem of concurrency due to a new action, by undoing action that should be executed
     * after the new function, and then re executing all of them in the correct order.
     * @param action the new action, in concurrency with the previous ones
     */

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

    /**
     * set the time stamp to the max between the current time stamp and the last time stamp received from a peer
     * delete all the previous actions which have a time stamp as it can't receive a message concurrent to it anymore. 
     * @param action the new action that just has been executed
     */
    update(action: Action): void {
        ActionManager.timeStamp = Math.max(ActionManager.timeStamp, action.timeStamp);
        /*let minTS = ActionManager.timeStamp;
        for (let peerInfo of ActionManager.lastPeerTimeStamps) {
          if (peerInfo[0] === action.userId) {
            peerInfo[1] = action.timeStamp;
          }
          minTS = Math.min(minTS, peerInfo[1]);
        }
        for (let a of this.doneActions) {
          if (a.timeStamp <= minTS) {
            this.doneActions = this.doneActions.filter( (el) => el !== a);
          }
        }*/
     }

     /**
       * add a new peer to the list of the peer time stamps, his time stamp is set to 0
      * @param peerId the id of the new connected peer
      */
     static addNewPeer(peerId: string): void {
       ActionManager.lastPeerTimeStamps.push([peerId, 0]);
     }

     /**
       * add a new peer to the list of the peer time stamps, his time stamp is set to 0
      * @param peerId the id of the new connected peer
      */
     static removePeer(peerId: string): void {
       ActionManager.lastPeerTimeStamps = ActionManager.lastPeerTimeStamps.filter((el) => el[0] !== peerId) ;
     }
    /**
     * Set the listeners for Action that need to be apply to the canvas.
     */
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

    /**
     * Return the current value of the timestamp
     */
    static getTimeStamp(): number {
        ActionManager.timeStamp += 1;
        return ActionManager.timeStamp;
    }
}
