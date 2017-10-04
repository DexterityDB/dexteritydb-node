import { Collection } from './Collection';
import { PayloadRequestType } from './Request';
import { FetchResult } from './Response';
import * as Utils from './Utils';

// TODO: Research on Better Metrics like available memory and timing
const BUFFER_AHEAD_MIN = 2500;
const BUFFER_AHEAD_MAX = 5000;
const DBFETCHLIMIT = 10000;

interface RequestCallback {
    resolve: Function,
    reject: Function,
    amount?: number
}

export class Cursor {
    private id: string | null = null;
    private totalSize: number;
    private remaining: number = 0;
    private userRequested: number = 0;
    private requestQueue: RequestCallback[] = [];
    private activeBatchRequest: Promise<any> | null = null;

    constructor(private collection: Collection, cursor: Utils.Cursor | null, private buffer: Utils.Value[], private explain: any) {
        if (cursor != null) {
            this.id = cursor.id;
            this.remaining = cursor.size;
            this.totalSize = cursor.size + buffer.length;
            this.fetchMore();
        } else {
            this.totalSize = buffer.length;
        }
    }

    getRemaining() {
        return this.remaining + this.buffer.length - this.userRequested;
    }

    getResultSize() {
        return this.totalSize;
    }

    getBenchResults() {
        return this.explain; 
    }

    next(amount?: number): Promise<any> {
        const cursor = this;
        let promise: Promise<any>;
        if (amount == null) {
            if (cursor.buffer.length >= 1 && cursor.requestQueue.length === 0) {
                promise = new Promise((resolve, reject) => {
                    resolve(cursor.buffer.shift());
                });
            } else {
                cursor.userRequested += 1;
                promise = new Promise((resolve, reject) => {
                    cursor.requestQueue.push({ resolve, reject });
                });
            }
        } else {

            amount = Math.min(this.getRemaining(), amount);

            if (amount <= cursor.buffer.length && cursor.requestQueue.length === 0) {
                promise = new Promise((resolve, reject) => {
                    resolve(cursor.buffer.splice(0, amount));
                });
            } else {
                cursor.userRequested += amount;
                promise = new Promise((resolve, reject) => {
                    cursor.requestQueue.push({ resolve, reject, amount });
                });
            }
        }
        
        cursor.fetchMore();
        
        return promise;
    }

    collect(): Promise<any> {
        return this.next(this.getRemaining());
    }

    private fetchMore(amount: number = DBFETCHLIMIT) {
        const cursor = this;
        if (cursor.activeBatchRequest != null || cursor.requestQueue.length === 0) { return; }
        if (cursor.requestQueue.length > 0 && cursor.remaining === 0) {
            cursor.userRequested = 0;
            for (const promise of cursor.requestQueue) {
                if (promise.amount == null) {
                    promise.resolve(null);
                } else {
                    promise.resolve(cursor.buffer.splice(0, promise.amount));
                }
            }
            cursor.requestQueue = [];
            return;
        }
        cursor.activeBatchRequest = cursor.collection.db.sendJSON({ type: PayloadRequestType.Cursor, data: { id: cursor.id, size: amount} }, cursor.collection.explain, cursor.collection.collectionName);
        cursor.activeBatchRequest.then((result: FetchResult) => {
            cursor.remaining -= result.items.length;
            cursor.buffer = cursor.buffer.concat(result.items);
            let finishedAmount = 0;
            for (const promise of cursor.requestQueue) {
                if (promise.amount != null) {
                    if (promise.amount <= cursor.buffer.length) {
                        cursor.userRequested -= promise.amount;
                        promise.resolve(cursor.buffer.splice(0, promise.amount));
                    } else {
                        break;
                    }
                } else if (cursor.buffer.length > 0) {
                    cursor.userRequested -= 1;
                    promise.resolve(cursor.buffer.shift());
                } else {
                    break;
                }

                finishedAmount += 1;
            }

            cursor.requestQueue.splice(0, finishedAmount);
            cursor.activeBatchRequest = null;
            cursor.fetchMore();
        });
    }
    
    /*
    TODO: drop() {

    }
    */
}