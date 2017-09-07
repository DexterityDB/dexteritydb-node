import * as WebSocket from 'ws';
import { ReadOp } from './Ops';
import { ResponseMessage } from './Response';

interface RequestCallback {
    resolve: Function,
    reject: Function
}

class ReadQuery {
    private collection: Collection;
    private optree: ReadOp;

    constructor(collection: Collection) {

    }
    
    aggregate() {}
    count() {}
    fetch() {}
    send() {}
    and() {}
    or() {}
}

class Collection {
    private db: Dex;
    private collectionName: string;
    
    constructor(db: Dex, collectionName: string) {
        this.db = db;
        this.collectionName = collectionName;
    }

    find() {}
    insert() {}
    update() {}
    remove() {}
    ensureIndex() {}
    removeIndex() {}
    removeCollection() {}
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
                message_data = JSON.parse(message.data.toString());
            } catch (err) {
                console.error(err);
                return;
            }

            if (message_data.request_id != null) {
                const callback = activeRequests.get(message_data.request_id);
                if (callback != null) {
                    activeRequests.delete(message_data.request_id);
                    callback.resolve(message_data.payload.data);
                }
            }
        }
    }

    collection(collectionName: string) {
        return new Collection(this, collectionName);
    }

    and(){}
    or() {}
}