"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const Collection_1 = require("./Collection");
const Ops = require("./Ops");
const Request_1 = require("./Request");
const Utils = require("./Utils");
class Dex {
    constructor(url = "", allowReconnect = true) {
        this.url = url;
        this.allowReconnect = allowReconnect;
        this.activeRequests = new Map();
        this.requestQueue = [];
        this.closed = true;
        if (this.url !== "") {
            this.connect();
        }
    }
    isOpen() {
        return !this.isClosed();
    }
    isClosed() {
        return this.closed;
    }
    isReady() {
        return this.ws != null && this.ws.readyState === WebSocket.OPEN;
    }
    connect(url = this.url) {
        if (url === "") {
            throw 'No connection URL given!';
        }
        const db = this;
        db.closed = false;
        if (db.ws != null) {
            return;
        }
        db.ws = new WebSocket(db.url);
        db.ws.addEventListener("open", () => {
            // Send queued requests
            for (const request of db.requestQueue) {
                db.ws.send(request.message);
                db.activeRequests.set(request.request_id, request.callback);
            }
            db.requestQueue = []; // Reset request queue after sending queued requests
        });
        db.ws.addEventListener("close", () => {
            db.ws = null;
            if (db.allowReconnect && db.isOpen()) {
                setTimeout(db.connect.bind(db), 5000);
            }
        });
        db.ws.addEventListener("message", (message) => {
            let messageData;
            try {
                messageData = JSON.parse(message.data.toString());
            }
            catch (err) {
                return console.error(err);
            }
            if (messageData.request_id != null) {
                const callback = db.activeRequests.get(messageData.request_id);
                if (callback != null) {
                    db.activeRequests.delete(messageData.request_id);
                    callback.resolve(messageData.payload.data);
                }
            }
        });
        // This event listener is present only to catch fail-to-connect error
        db.ws.addEventListener("error", (error) => { });
    }
    close() {
        this.closed = true;
        if (this.ws != null) {
            this.ws.close();
        }
    }
    sendJSON(payload, explain, collectionName) {
        const db = this;
        return new Promise((resolve, reject) => {
            let request_id = Utils.randomString(12);
            const message = JSON.stringify({
                request_id: request_id,
                collection: {
                    db: "test",
                    collection: collectionName
                },
                payload: payload,
                explain: explain
            });
            const callback = { resolve, reject };
            console.log(payload);
            if (db.isReady()) {
                db.ws.send(message);
                db.activeRequests.set(request_id, callback);
            }
            else {
                this.requestQueue.push({ request_id, message, callback });
            }
        });
    }
    collection(collectionName) {
        return new Collection_1.Collection(this, collectionName);
    }
    dropCollection(collectionName) {
        return this.sendJSON({ type: Request_1.PayloadRequestType.RemoveCollection }, false, collectionName);
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
    static delete() {
        return new Ops.PartialDelete;
    }
    static exclude(...fields) {
        return new Ops.PartialExclude(...fields);
    }
    static include(...fields) {
        return new Ops.PartialInclude(...fields);
    }
}
exports.Dex = Dex;
