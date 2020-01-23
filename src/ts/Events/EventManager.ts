import { Action, ActionManager } from "../Actions/ActionManager";
import {DisconectEvent} from "../Events/DisconectEvent";

/** Id of a personalized Event. */
export type EventID = string;

/** Interface for personalized Events. */
export interface Event { id: EventID; }
export interface ActionEvent extends Event { action: Action; }

/** Type for function that handles personalized Events. */
export type EventHandler<E extends Event> = (e: Event) => void;

/** A class to register handlers and emit personalized events. */
export class EventManager {
    /** List of handlers registered per personalized event. */
    private static eventHandlers: Map<EventID, EventHandler<any>[]> = new Map();
    constructor() {}

    static staticConstructor() {
      window.onbeforeunload = sendEvent;
      function sendEvent(){
          EventManager.emit(new DisconectEvent(ActionManager.userId, ActionManager.getTimeStamp()));
          return "You have attempted to leave this page. Are you sure?";
      };
    }

    /**
     * Registers a handler for a personalized Event.
     * @param eventId Id of the personalized Event.
     * @param eventHandler Handler to register.
     */
    static registerHandler(eventId: EventID, eventHandler: EventHandler<any>): void {
        if (!EventManager.eventHandlers.has(eventId)) {
            EventManager.eventHandlers.set(eventId, []);
        }

        EventManager.eventHandlers.get(eventId).push(eventHandler);
    }

    /**
     * Call each handler registered for a personalized Event.
     * @param event Personalized event triggered.
     */
    static emit(event: Event): void {
        if (!EventManager.eventHandlers.has(event.id)) {
          console.log(event.id, EventManager.eventHandlers);

            return;
        }
        EventManager.eventHandlers.get(event.id)
            .forEach((eventHandler: EventHandler<any>) => {
                eventHandler(event);
            });
    }
}
EventManager.staticConstructor();
