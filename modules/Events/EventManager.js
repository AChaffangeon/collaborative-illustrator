"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventManager {
    constructor() {
    }
    static registerHandler(eventId, eventHandler) {
        if (!EventManager.eventHandlers.has(eventId)) {
            EventManager.eventHandlers.set(eventId, []);
        }
        EventManager.eventHandlers.get(eventId).push(eventHandler);
    }
    static emit(event) {
        if (!EventManager.eventHandlers.has(event.id)) {
            return;
        }
        EventManager.eventHandlers.get(event.id)
            .forEach((eventHandler) => {
            eventHandler(event);
        });
    }
}
exports.EventManager = EventManager;
EventManager.eventHandlers = new Map();
//# sourceMappingURL=EventManager.js.map