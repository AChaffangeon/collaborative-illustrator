import { Canvas } from "../View/Canvas";
import { EventManager } from "../Events/EventManager";
import { ShapeCreatedEvent } from "../Events/ShapeCreatedEvent";
import { StrokeChangedEvent } from "../Events/StrokeChangedEvent";
import { StrokeWidthChangedEvent } from "../Events/StrokeWidthChangedEvent";
import { FillChangedEvent } from "../Events/FillChangedEvent";
import { TranslateShapeEvent } from "../Events/TranslateShapeEvent";

/** Id of an Action. */
export type ActionID = string;

/** Interface for Actions. */
export interface Action {type: string; userId: ActionID; objectId: string; timeStamp: number; do: (canvas: Canvas) => void; undo: (canvas: Canvas) => void; }

/** A class to manage and apply actions on a Canvas. */
export class ActionManager {

    static userId: string = `User_${Date.now() + Math.random()}`;
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

    getHigherId(a, b) {
      let aNum = parseFloat(a.userId.replace(/[^0-9]/g, ""));
      let bNum = parseFloat(b.userId.replace(/[^0-9]/g, ""));

      console.log(aNum, bNum);
      if ( aNum < bNum ){
        return -1;
      }
      else if(aNum === bNum) {
        if(a.timeStamp < b.timeStamp){
          return -1;
        }else{
          return 1
        }
      }else{
        return 1;
      }
      return 0;
    }

    manageActions(action: Action): void {
        console.log("action", action);

        if(action.timeStamp != ActionManager.timeStamp){
          let concurrentActions = [];
          for ( let a of this.doneActions){
            if(a.type === action.type && a.objectId === action.objectId){
              concurrentActions.push(a);
            }

            for(let a of concurrentActions){
              this.undo(a);
            }

            concurrentActions.push(action);
            concurrentActions.sort(this.getHigherId);
            console.log(concurrentActions);

            for(let a of concurrentActions){
              this.do(a);
            }

          }

        }else{
          this.doneActions.push(action);
          this.do(action);
        }


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
        let t = ActionManager.timeStamp;

        return t;
    }
}
