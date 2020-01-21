import { Action } from "../Actions/ActionManager";

/** Id of a personalized Event. */
export type EventID = string;

/** Interface for personalized Events. */
export interface Event { id: EventID; action: Action; }

/** Type for function that handles personalized Events. */
export type EventHandler<E extends Event> = (e: Event) => void;

/** A class to register handlers and emit personalized events. */
export class EventManager {
    /** List of handlers registered per personalized event. */
    private static eventHandlers: Map<EventID, EventHandler<any>[]> = new Map();
    constructor() { }

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
            return;
        }
        EventManager.eventHandlers.get(event.id)
            .forEach((eventHandler: EventHandler<any>) => {
                eventHandler(event);
            });
    }
}
