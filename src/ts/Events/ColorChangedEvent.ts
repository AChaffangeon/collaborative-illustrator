import { Event } from "./EventManager";

export class ColorChangedEvent implements Event{
  id: string = "colorChanged";
  color: string;

  constructor(color: string) {
    this.color = color;
  }
}