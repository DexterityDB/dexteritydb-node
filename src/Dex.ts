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

/**
 * Purpose: The main database object that is used in almost every call.
 * In most cases, there should be only 1 instance of the ```Dex``` class in any single piece of code
 * @param { string } [url=""] Indicates the database address to connect to
 * If this parameter is provided, the driver will automatically begin the connection process
 * If not, then the user is required to use ```Dex.connect``` when it is time to connect.
 * @param { boolean } [allowReconnect=true] Indicates if the driver should try to reconnect to the database after the websocket is unintentionally closed
 */
export class Dex {
    private ws: WebSocket | null;
    private activeRequests: Map<string, RequestCallback> = new Map<string, RequestCallback>();
    private requestQueue: QueuedMessage[] = [];
    private closed: boolean = true;

    constructor(private url: string = "", public allowReconnect = true) {
        if (this.url !== "") { this.connect(); }
    }

    /**
     * Purpose: Check if the websocket connection has not been manually closed (manual closure of websocket connection will prevent the websocket from trying to reconnect)
     * @returns { boolean } ```true``` if websocket is not manually closed, ```false``` if it has been manually closed
     */
    isOpen(): boolean {
        return !this.isClosed();
    }

    /**
     * Purpose: Check if the websocket connection has been manually closed (prevents reconnections until ```Dex.connect``` is manually called)
     * @returns { boolean } ```true``` if websocket has been manually closed, ```false``` if it has not
     */
    isClosed(): boolean {
        return this.closed;
    }

    /**
     * Purpose: Check if the websocket connection is established and ready for querying
     * @returns { boolean } ```true``` if ready, ```false``` if not
     */
    isReady(): boolean {
        return this.ws != null && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * Purpose: Begin connection with database
     * 
     * Note: This function is unnecessary if a url was passed to the ```Dex``` object when constructing it.
     * This function is only necessary if no url was passed or if the websocket connection has been manually closed with ```Dex.close```
     * @param { string } url Indicates the database address to connect to
     */
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

    /**
     * Purpose: Manually disconnect from the database and close websocket connection
     * 
     * Note: This function overrides the ```allowReconnect``` setting and will prevent the websocket from reestablishing a connection.
     * To reconnect after running this function, use ```Dex.connect```
     */
    close() {
        this.closed = true;
        if (this.ws != null) {
            this.ws.close();
        }
    }

    // Use to send messages to the database. Should not be called by user
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

    /**
     * Purpose: Returns a ```Collection``` object, which can be used to query the database - see ```Collection``` for more details
     * @param { string } collectionName The name of the collection that you want to query on
     * @returns { Collection } A ```Collection``` object that corresponds to the collection on the database that has the same ```collectionName```
     */
    collection(collectionName: string): Collection {
        return new Collection(this, collectionName);
    }
    
    /**
     * Purpose: Drop or remove a collection (and its contents) from the database
     * @param { string } collectionName 
     * @returns { Promise } ```true``` if collection was dropped, ```false``` if unsuccessful
     */
    dropCollection(collectionName: string): PromiseResult<any> {
        return this.sendJSON({ type: PayloadRequestType.RemoveCollection }, false, collectionName);
    }

    /**
     * Purpose: A shorthand operator used in ```find``` queries to match fields that have a value equal to the passed value. Usually unnecessary as this is the default operator
     * @param { Value } value The ```Value``` that the field must contain to indicate a matched item
     * @returns { PartialEq } A ```PartialEq``` that will resolve to a ```LoadEq``` operator that can be used in ```find``` queries
     */
    static eq(value: Value): Ops.PartialEq {
        return new Ops.PartialEq(value);
    }
    /**
     * Purpose: A shorthand operator used in ```find``` queries to match fields that have a value equal to any one of the passed values
     * @param { ...Value } value The ```Value```s that the field must contain at least one of to indicate a matched item
     * @returns { PartialIn } A ```PartialIn``` that will resolve to a ```LoadIn``` operator that can be used in ```find``` queries
     */
    static in(...values: Value[]): Ops.PartialIn {
        return new Ops.PartialIn(...values);
    }
    /**
     * Purpose: A shorthand operator used in ```find``` queries to match fields that have a value less than the passed value
     * @param { Value } value The ```Value``` that the field's value is compared to
     * @returns { PartialLt } A ```PartialLt``` that will resolve to a ```LoadLt``` operator that can be used in ```find``` queries
     */
    static lt(value: Value): Ops.PartialLt {
        return new Ops.PartialLt(value);
    }
    /**
     * Purpose: A shorthand operator used in ```find``` queries to match fields that have a value less than or equal to the passed value
     * @param { Value } value The ```Value``` that the field's value is compared to
     * @returns { PartialLte } A ```PartialLte``` that will resolve to a ```LoadLte``` operator that can be used in ```find``` queries
     */
    static lte(value: Value): Ops.PartialLte {
        return new Ops.PartialLte(value);
    }
    /**
     * Purpose: A shorthand operator used in ```find``` queries to match fields that have a value greater than the passed value
     * @param { Value } value The ```Value``` that the field's value is compared to
     * @returns { PartialGt } A ```PartialGt``` that will resolve to a ```LoadGt``` operator that can be used in ```find``` queries
     */
    static gt(value: Value): Ops.PartialGt {
        return new Ops.PartialGt(value);
    }
    /**
     * Purpose: A shorthand operator used in ```find``` queries to match fields that have a value greater than or equal to the passed value
     * @param { Value } value The ```Value``` that the field's value is compared to
     * @returns { PartialGte } A ```PartialGte``` that will resolve to a ```LoadGte``` operator that can be used in ```find``` queries
     */
    static gte(value: Value): Ops.PartialGte {
        return new Ops.PartialGte(value);
    }
    /**
     * Purpose: A shorthand operator used in ```find``` queries to match fields that have a value greater than the start ```Value``` and less than the end ```Value```
     * @param { Value } start The ```Value``` that the field's value must be greater than
     * @param { Value } end The ```Value``` that the field's value must be less than
     * @returns { PartialGtLt } A ```PartialGtLt``` that will resolve to a ```LoadGtLt``` operator that can be used in ```find``` queries
     */
    static gt_lt(start: Value, end: Value): Ops.PartialGtLt {
        return new Ops.PartialGtLt(start, end);
    }
    /**
     * Purpose: A shorthand operator used in ```find``` queries to match fields that have a value greater than or equal to the start ```Value``` and less than the end ```Value```
     * @param { Value } start The ```Value``` that the field's value must be greater than or equal to
     * @param { Value } end The ```Value``` that the field's value must be less than
     * @returns { PartialGteLt } A ```PartialGteLt``` that will resolve to a ```LoadGteLt``` operator that can be used in ```find``` queries
     */
    static gte_lt(start: Value, end: Value): Ops.PartialGteLt {
        return new Ops.PartialGteLt(start, end);
    }
    /**
     * Purpose: A shorthand operator used in ```find``` queries to match fields that have a value greater than the start ```Value``` and less than or equal to the end ```Value```
     * @param { Value } start The ```Value``` that the field's value must be greater than
     * @param { Value } end The ```Value``` that the field's value must be less than or equal to
     * @returns { PartialGtLte } A ```PartialGtLte``` that will resolve to a ```LoadGtLte``` operator that can be used in ```find``` queries
     */
    static gt_lte(start: Value, end: Value): Ops.PartialGtLte {
        return new Ops.PartialGtLte(start, end);
    }
    /**
     * Purpose: A shorthand operator used in ```find``` queries to match fields that have a value greater than or equal to the start ```Value``` and less than or equal to the end ```Value```
     * @param { Value } start The ```Value``` that the field's value must be greater than or equal to
     * @param { Value } end The ```Value``` that the field's value must be less than or equal to
     * @returns { PartialGteLte } A ```PartialGteLte``` that will resolve to a ```LoadGteLte``` operator that can be used in ```find``` queries
     */
    static gte_lte(start: Value, end: Value): Ops.PartialGteLte {
        return new Ops.PartialGteLte(start, end);
    }

    /**
     * Purpose: A shorthand operator used in ```find``` queries to "And" 2 or more patterns together for searching capabilities
     * @param { ReadOp | JSON } ops The patterns being "And"ed together
     * @returns { And } An ```And``` ```ReadOp``` that can be used in ```find``` queries
     */
    static and(...ops: (Ops.ReadOp | object)[]): Ops.And {
        return new Ops.And(...ops);
    }
    /**
     * Purpose: A shorthand operator used in ```find``` queries to "Or" 2 or more patterns together for searching capabilities
     * @param { ReadOp | JSON } ops The patterns being "Or"ed together
     * @returns { Or } An ```Or``` ```ReadOp``` that can be used in ```find``` queries
     */
    static or(...ops: (Ops.ReadOp | object)[]): Ops.Or {
        return new Ops.Or(...ops);
    }

    /**
     * Purpose: A shorthand operator used in ```update``` queries to indicate a field that should be removed from the items that were found
     * @returns { PartialDelete } A ```PartialDelete``` which is used in an ```update``` query to modify items in the database
     */
    static delete(): Ops.PartialDelete {
        return new Ops.PartialDelete;
    }

    /**
     * Purpose: A shorthand operator used in ```project``` queries to indicate fields that should be excluded from the result set of items
     * @param { string } fields The fields that should not be included in the returned result set
     * @returns { PartialExclude } A ```PartialExclude``` which is used in a ```project``` query to filter results
     */
    static exclude(...fields: string[]): Ops.PartialExclude {
        return new Ops.PartialExclude(...fields);
    }
    /**
     * Purpose: A shorthand operator used in ```project``` queries to indicate fields that should be included in the result set of items. Results in all other fields being excluded
     * @param { string } fields The fields that should be included in the returned result set
     * @returns { PartialInclude } A ```PartialInclude``` which is used in a ```project``` query to filter results
     */
    static include(...fields: string[]): Ops.PartialInclude {
        return new Ops.PartialInclude(...fields);
    }
}