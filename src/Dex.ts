import * as Webserver from 'ws';

interface CollectionTag {
    db: string,
    collection: string
}

interface FieldValue {
    field: string,
    value: Value
}

interface FieldValues {
    field: string,
    values: [Value]
}

interface FieldValueRange {
    field: string,
    low: Value,
    high: Value
}

interface PayloadRequest {
    none?: boolean,
    count?: [Ops],
    list?: [Ops],
    fetch?: [Ops],
    insert?: [Ops],
    update?: [Ops],
    remove?: [Ops],
    ensureIndex?: [Ops],
    removeIndex?: [Ops],
    removeCollection?: boolean
}

interface RequestCallback {
    resolve: Function,
    reject: Function
}

interface ResponseMessage {
    request_id: string
    payload: PayloadRequest,
    collection: CollectionTag
}

export class Dex {
    _url: string;
    _ready: boolean;
    constructor(url: string) {
        this._url = url;
        let activeRequests = new Map<string, RequestCallback>();
        const db = this;
        const ws = new WebSocket(url);
        ws.onopen = function() {
            db._ready = true;
            console.log("Connected to DexterityDB");
        };
        ws.onclose = function() {
            if (db._ready) {
                console.log("Disconnected from DexterityDB")
                db._ready = false;
            }
        };
        ws.onmessage = function(message) {
            let message_data: ResponseMessage;
            try {
                message_data = JSON.parse(message.data);
            } catch (err) {
                console.error(err);
                return;
            }

            if (message_data.request_id != null) {
                const callback = activeRequests.get(message_data.request_id);
                if (callback != null) {
                    activeRequests.delete(message_data.request_id);
                    callback.resolve(message);
                }
            }
        }
    }
}