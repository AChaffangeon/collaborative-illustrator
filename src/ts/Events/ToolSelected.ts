import { Event } from "./EventManager";
import { ToolID } from "../View/ToolBar/ToolBar";

export class ToolSelectedEvent implements Event {
    id: string = "toolSelected";
    toolId: ToolID;

    constructor(toolID: ToolID) {
        this.toolId = toolID;
    }
}