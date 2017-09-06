"use strict";
const WebSocket = require('ws');

// Overarching class for interacting with the Dexterity database
export class Dex {
    constructor(url) {
        this._url = url;
        let activeRequests = {};
        let db = this;
        ws = new WebSocket(url);
        ws.onopen = function() {
            db._ready = true;
            console.log('Connected to DexDB');
        };
        ws.onclose = function() {
            if (db._ready) {
                console.log('Disconnected from DexDB');
                db._ready = false;
            }
        };
        ws.onmessage = function(message) {
            try {
                message = JSON.parse(message.data);
            } catch (err) {
                console.error(err);
            }

            if (message.request_id && activeRequests[message.request_id] != null) {
                const callback = activeRequests[message.request_id];
                delete activeRequests[message.request_id];
                callback.resolve(message);
            }
        }
    }

    get url() { return this._url; }
    get ready() { return this._ready; }

    disconnect() {}
    count() {}
    list() {}
    fetch() {}
    insert() {}
    update() {}
    remove() {}
    ensureIndex() {}
    removeIndex() {}
    removeCollection() {}


}