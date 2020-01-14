import { Event } from "./EventManager";
import { UpdateColorAction } from "../Actions/UpdateColorAction";

export class ColorChangedEvent implements Event{
  id: string = "colorChanged";
  action: UpdateColorAction;

  constructor(color: string, shapeId: string) {
    this.action = new UpdateColorAction(color, shapeId);
  }
}