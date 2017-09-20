import * as WebSocket from 'ws';
import { Collection } from './Collection';
import * as Ops from './Ops';
import { ExplainResult, PromiseResult } from './PromiseResult';
import { Query } from './Query';
import { PayloadRequest, PayloadRequestType } from './Request';
import { ResponseMessage } from './Response';
import { Value } from './Utils';
import * as Utils from './Utils';

interface RequestCallback {
    resolve: Function,
    reject: Function
}

interface QueuedMessage {
    request_id: string,
    message: string,
    callback: RequestCallback
}

export class Dex {
    private ws: WebSocket | null;
    private activeRequests: Map<string, RequestCallback> = new Map<string, RequestCallback>();
    private requestQueue: QueuedMessage[] = [];
    private closed: boolean = true;

    constructor(private url: string = "", public allowReconnect = true) {
        if (this.url !== "") { this.connect(); }
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

    connect(url: string = this.url) {
        if (url === "") { throw 'No connection URL given!'; }
        const db = this;
        db.closed = false;
        if (db.ws != null) {
            return;
        }
        db.ws = new WebSocket(db.url);

        db.ws.addEventListener("open", () => {
            // Send queued requests
            for (const request of db.requestQueue) {
                (db.ws as WebSocket).send(request.message);
                db.activeRequests.set(request.request_id, request.callback);
            }
            db.requestQueue = []; // Reset request queue after sending queued requests
        });

        db.ws.addEventListener("close", () => {
            db.ws = null;
            // TODO: remove next "for loop" after this line when database supports preservation of active requests
            // Kill all active requests - reconnection will not preserve active requests
            for (const callback of db.activeRequests.values()) {
                callback.reject();
            }
            db.activeRequests.clear();
            // Check if reconnection should be attempted
            if (db.allowReconnect && db.isOpen()) {
                setTimeout(db.connect.bind(db), 5000);
            }
        });

        db.ws.addEventListener("message", (message) => {
            let messageData: ResponseMessage;
            try {
                messageData = JSON.parse(message.data.toString());
            } catch (err) {
                return console.error(err);
            }

            if (messageData.request_id != null) {
                const callback = db.activeRequests.get(messageData.request_id);
                if (callback != null) {
                    db.activeRequests.delete(messageData.request_id);
                    callback.resolve(new ExplainResult(messageData.payload.data, messageData.explain));
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

    sendJSON(payload: PayloadRequest, explain: boolean, collectionName: string): PromiseResult<any> {
        const db = this;
        return new PromiseResult((resolve, reject) => {
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

            if (db.isReady()) {
                (db.ws as WebSocket).send(message);
                db.activeRequests.set(request_id, callback);
            } else {
                this.requestQueue.push({ request_id, message, callback });
            }
        });
    }

    collection(collectionName: string) {
        return new Collection(this, collectionName);
    }
    
    dropCollection(collectionName: string): PromiseResult<any> {
        return this.sendJSON({ type: PayloadRequestType.RemoveCollection }, false, collectionName);
    }

    static eq(value: Value): Ops.PartialEq {
        return new Ops.PartialEq(value);
    }
    static in(...values: Value[]): Ops.PartialIn {
        return new Ops.PartialIn(...values);
    }
    static lt(value: Value): Ops.PartialLt {
        return new Ops.PartialLt(value);
    }
    static lte(value: Value): Ops.PartialLte {
        return new Ops.PartialLte(value);
    }
    static gt(value: Value): Ops.PartialGt {
        return new Ops.PartialGt(value);
    }
    static gte(value: Value): Ops.PartialGte {
        return new Ops.PartialGte(value);
    }
    static gt_lt(start: Value, end: Value): Ops.PartialGtLt {
        return new Ops.PartialGtLt(start, end);
    }
    static gte_lt(start: Value, end: Value): Ops.PartialGteLt {
        return new Ops.PartialGteLt(start, end);
    }
    static gt_lte(start: Value, end: Value): Ops.PartialGtLte {
        return new Ops.PartialGtLte(start, end);
    }
    static gte_lte(start: Value, end: Value): Ops.PartialGteLte {
        return new Ops.PartialGteLte(start, end);
    }

    static and(...ops: (Ops.ReadOp | object)[]): Ops.And {
        return new Ops.And(...ops);
    }
    static or(...ops: (Ops.ReadOp | object)[]): Ops.Or {
        return new Ops.Or(...ops);
    }

    static delete(): Ops.PartialDelete {
        return new Ops.PartialDelete;
    }

    static exclude(...fields: string[]) {
        return new Ops.PartialExclude(...fields);
    }
    static include(...fields: string[]) {
        return new Ops.PartialInclude(...fields);
    }
}