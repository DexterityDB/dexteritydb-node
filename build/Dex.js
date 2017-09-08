"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const Collection_1 = require("./Collection");
const Ops = require("./Ops");
class Dex {
    constructor(url) {
        this.url = url;
        this.ready = false;
        let activeRequests = new Map();
        const db = this;
        const ws = new WebSocket(url);
        ws.addEventListener("open", () => {
            db.ready = true;
            console.log("Connected to DexterityDB");
        });
        ws.addEventListener("close", () => {
            if (db.ready) {
                console.log("Disconnected from DexterityDB");
                db.ready = false;
                // TODO: Auto-reconnect
            }
        });
        ws.addEventListener("message", (message) => {
            let messageData;
            try {
                messageData = JSON.parse(message.data.toString());
            }
            catch (err) {
                return console.error(err);
            }
            if (messageData.request_id != null) {
                const callback = activeRequests.get(messageData.request_id);
                if (callback != null) {
                    activeRequests.delete(messageData.request_id);
                    callback.resolve(messageData.payload.data);
                }
            }
        });
    }
    collection(collectionName) {
        return new Collection_1.Collection(this, collectionName);
    }
    static eq(value) {
        return new Ops.PartialEq(value);
    }
    static in(...values) {
        return new Ops.PartialIn(...values);
    }
    static lt(value) {
        return new Ops.PartialLt(value);
    }
    static lte(value) {
        return new Ops.PartialLte(value);
    }
    static gt(value) {
        return new Ops.PartialGt(value);
    }
    static gte(value) {
        return new Ops.PartialGte(value);
    }
    static gt_lt(start, end) {
        return new Ops.PartialGtLt(start, end);
    }
    static gte_lt(start, end) {
        return new Ops.PartialGteLt(start, end);
    }
    static gt_lte(start, end) {
        return new Ops.PartialGtLte(start, end);
    }
    static gte_lte(start, end) {
        return new Ops.PartialGteLte(start, end);
    }
    static and(...ops) {
        return new Ops.And(...ops);
    }
    static or(...ops) {
        return new Ops.Or(...ops);
    }
}
exports.Dex = Dex;
