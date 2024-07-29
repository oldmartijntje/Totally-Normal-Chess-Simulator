class Events {
    callbacks = [];
    nextId = 0;

    emit(eventName, value) {
        this.callbacks.forEach(stored => {
            if (stored.eventName === eventName) {
                stored.callback(value);
            }

        })
    }

    on(eventName, caller, callback) {
        this.nextId++;
        this.callbacks.push({
            id: this.nextId,
            eventName: eventName,
            caller: caller,
            callback: callback
        });
        return this.nextId;
    }

    off(id) {
        this.callbacks = this.callbacks.filter(stored => stored.id !== id);
    }

    unsubscribe(caller) {
        this.callbacks = this.callbacks.filter(stored => stored.caller !== caller);
    }
}

const allEvents = new Events();