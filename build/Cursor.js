"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = require("./Request");
// TODO: Research on Better Metrics like available memory and timing
const BUFFER_AHEAD_MIN = 2500;
const BUFFER_AHEAD_MAX = 5000;
const DBFETCHLIMIT = 10000;
/**
 * Purpose: A class that allows for streaming the results returned from a fetch.
 * ```Cursor```s are used to prevent large amounts of result data from being returned all at once.
 * Streaming these results with a ```Cursor``` allows the results to be more efficiently loaded into the Node.js script, when they are actually needed.
 *
 * Note: A ```Cursor``` contains a snapshot of the results at the moment the ```Cursor``` is returned.
 * The results on a ```Cursor``` will not be affected by sequential updates and other writes to the database.
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 */
class Cursor {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(collection, cursor, buffer, explain) {
        this.collection = collection;
        this.buffer = buffer;
        this.explain = explain;
        this.id = null;
        this.remaining = 0;
        this.userRequested = 0;
        this.requestQueue = [];
        this.activeBatchRequest = null;
        if (cursor != null) {
            this.id = cursor.id;
            this.remaining = cursor.size;
            this.totalSize = cursor.size + buffer.length;
            this.fetchMore();
        }
        else {
            this.totalSize = buffer.length;
        }
    }
    /**
     * Purpose: Returns the number of results that have not been returned from the ```Cursor```
     *
     * Example:
     * ```javascript
     * collection.find({ position: "developer" }).fetch().then((cursor) => {
     *  console.log("Remaining Results: ", cursor.getRemaining());
     * });
     * ```
     * @returns { number } The number of results on the ```Cursor``` that have not been returned to the user yet
     */
    getRemaining() {
        return this.remaining + this.buffer.length - this.userRequested;
    }
    /**
     * Purpose: Returns the number of total results from the query that returned the ```Cursor```
     *
     * Example:
     * ```javascript
     * collection.find({ position: "developer" }).fetch().then((cursor) => {
     *  console.log("Total Results: ", cursor.getTotalSize());
     * });
     * ```
     * @returns { number } The total number of results that were returned with the ```Cursor```
     */
    getResultSize() {
        return this.totalSize;
    }
    /**
     * Purpose: Returns the explain information from the query that returned the ```Cursor```
     *
     * Example:
     * ```javascript
     * collection.find({ position: "developer" }).fetch().then((cursor) => {
     *  console.log("Explain Results ", cursor.getExplainResults());
     * });
     * ```
     * @returns { JSON[] } The explain information from the query that returned the ```Cursor```
     */
    getExplainResults() {
        return this.explain;
    }
    /**
     * Purpose: Returns the next item or next set of items from the ```Cursor```.
     * ```Next``` also moves the location of the cursor to the item after the last one retrieved, effectively removing the returned item(s) from the ```Cursor```.
     *
     * Note: If no parameter is passed, a single item will be returned (the next item).
     * If a number is passed into the function, ```next``` will return that many results from the cursor in an ```Array``` structure.
     *
     * Example:
     * ```javascript
     * collection.find({ position: "developer" }).fetch().then((cursor) => {
     *  cursor.next().then((item) => {
     *      console.log(item);
     *  });
     * });
     * ```
     * @param { number } [amount] The number of items that should be returned from the ```Cursor```
     * @returns { Promise } The next item or set of items from the ```Cursor```
     */
    next(amount) {
        const cursor = this;
        let promise;
        if (amount == null) {
            if (cursor.buffer.length >= 1 && cursor.requestQueue.length === 0) {
                promise = new Promise((resolve, reject) => {
                    resolve(cursor.buffer.shift());
                });
            }
            else {
                cursor.userRequested += 1;
                promise = new Promise((resolve, reject) => {
                    cursor.requestQueue.push({ resolve, reject });
                });
            }
        }
        else {
            amount = Math.min(this.getRemaining(), amount);
            if (amount <= cursor.buffer.length && cursor.requestQueue.length === 0) {
                promise = new Promise((resolve, reject) => {
                    resolve(cursor.buffer.splice(0, amount));
                });
            }
            else {
                cursor.userRequested += amount;
                promise = new Promise((resolve, reject) => {
                    cursor.requestQueue.push({ resolve, reject, amount });
                });
            }
        }
        cursor.fetchMore();
        return promise;
    }
    /**
     * Purpose: Returns all items left on the ```Cursor```
     *
     * Example:
     * ```javascript
     * collection.find({ position: "developer" }).fetch().then((cursor) => {
     *  cursor.collect().then((items) => {
     *      console.log(items);
     *  });
     * });
     * ```
     * @returns { Promise } The rest of the items left on the ```Cursor``` in an ```Array```
     */
    collect() {
        return this.next(this.getRemaining());
    }
    // Used to request more results from the database to maintain buffer
    fetchMore(amount = DBFETCHLIMIT) {
        const cursor = this;
        if (cursor.activeBatchRequest != null || cursor.requestQueue.length === 0) {
            return;
        }
        if (cursor.requestQueue.length > 0 && cursor.remaining === 0) {
            cursor.userRequested = 0;
            for (const promise of cursor.requestQueue) {
                if (promise.amount == null) {
                    promise.resolve(null);
                }
                else {
                    promise.resolve(cursor.buffer.splice(0, promise.amount));
                }
            }
            cursor.requestQueue = [];
            return;
        }
        cursor.activeBatchRequest = cursor.collection.db.sendJSON({ type: Request_1.PayloadRequestType.Cursor, data: { id: cursor.id, size: amount } }, cursor.collection._explain, cursor.collection.collectionName);
        cursor.activeBatchRequest.then((result) => {
            cursor.remaining -= result.items.length;
            cursor.buffer = cursor.buffer.concat(result.items);
            let finishedAmount = 0;
            for (const promise of cursor.requestQueue) {
                if (promise.amount != null) {
                    if (promise.amount <= cursor.buffer.length) {
                        cursor.userRequested -= promise.amount;
                        promise.resolve(cursor.buffer.splice(0, promise.amount));
                    }
                    else {
                        break;
                    }
                }
                else if (cursor.buffer.length > 0) {
                    cursor.userRequested -= 1;
                    promise.resolve(cursor.buffer.shift());
                }
                else {
                    break;
                }
                finishedAmount += 1;
            }
            cursor.requestQueue.splice(0, finishedAmount);
            cursor.activeBatchRequest = null;
            cursor.fetchMore();
        }, (err) => { console.error("DexterityDB Internal Cursor Error:", err); });
    }
}
exports.Cursor = Cursor;
