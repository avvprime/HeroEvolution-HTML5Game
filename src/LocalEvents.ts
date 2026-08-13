type Listener = (...args: any[]) => void;

export default class LocalEvents {

    private _events: Partial<Record<string, Listener[]>> = {}

    constructor(events: string[]) {
        for (let i = 0; i < events.length; i++) this._events[events[i]] = [];
    }

    on(event: string, callback: Listener): void {
        const list = (this._events[event] ??= []);
        list.push(callback);
    }

    off(event: string, callback: Listener): void {
        const events: Listener[] | undefined = this._events[event];
        
        if (events === undefined) {
            console.log("Events: Couldn't find the requested event at 'off' ", event);
            return;
        }

        const idx = events.indexOf(callback);
        if (idx === -1) {
            console.log("Events: Callback already removed ", callback);
            return;
        }

        events.splice(idx, 1); 
    }

    emit(event: string, ...args: any[]): void {
        const events = this._events[event];
        if (events === undefined) {
            console.log("No event found to emit: ", event);
            return;
        }
        const totalCallbacks: number = events.length;
        for (let i = 0; i < totalCallbacks; i++) {
            events[i](...args);
        }
    }

}

