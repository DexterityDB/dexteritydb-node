import { Collection } from './Collection';
import { PayloadRequestType } from './Request';
import { FetchResult } from './Response';
import * as Utils from './Utils';

// TODO: Research on Better Metrics like available memory and timing
const BUFFER_AHEAD_MIN = 2500;
const BUFFER_AHEAD_MAX = 5000;

interface RequestCallback {
    resolve: Function,
    reject: Function,
    amount?: number
}

export class Cursor {
    private id: string;
    private totalSize: number;
    remaining: number;
    private userRequested: number = 0;
    private driverRequested: number = 0;
    private requestQueue: RequestCallback[] = [];

    constructor(private collection: Collection, cursor: Utils.Cursor, private buffer: Utils.Value[] = []) {
        this.id = cursor.id;
        this.remaining = cursor.size;
        this.totalSize = cursor.size + buffer.length;
    }

    getRemaining() {
        return this.remaining;
    }

    getResultSize() {
        return this.totalSize;
    }

    next(amount?: number): Promise<any> {
        const cursor = this;
        let promise: Promise<any>;
        if (amount == null) {
            if (cursor.buffer.length >= 1 && cursor.requestQueue.length === 0) {
                promise = new Promise((resolve, reject) => {
                    resolve(cursor.buffer.shift());
                });
            } else if (cursor.userRequested + 1 <= cursor.remaining) {
                cursor.userRequested += 1;
                promise = new Promise((resolve, reject) => {
                    cursor.requestQueue.push({ resolve, reject });
                });
            } else {
                return new Promise((resolve, reject) => {
                    cursor.requestQueue.push({ resolve, reject });
                });
            }
        } else {

            amount = Math.min(cursor.remaining - cursor.userRequested, amount);

            if (amount <= cursor.buffer.length && cursor.requestQueue.length === 0) {
                promise = new Promise((resolve, reject) => {
                    resolve(cursor.buffer.splice(0, amount));
                });
            } else if (cursor.userRequested < cursor.remaining) {
                cursor.userRequested += amount;
                promise = new Promise((resolve, reject) => {
                    cursor.requestQueue.push({ resolve, reject, amount });
                });
            } else {
                return new Promise((resolve, reject) => {
                    cursor.requestQueue.push({ resolve, reject, amount });
                });
            }
        }

        if (cursor.driverRequested - (cursor.userRequested - cursor.buffer.length) < BUFFER_AHEAD_MIN) {
            const requestedAmount = Math.min(5000 - (cursor.driverRequested - (cursor.userRequested - cursor.buffer.length)), cursor.remaining - cursor.driverRequested);
            cursor.driverRequested += requestedAmount;
            cursor.collection.db.sendJSON({ type: PayloadRequestType.Cursor, data: { id: cursor.id, size: requestedAmount} }, cursor.collection.explain, cursor.collection.collectionName)
                .then((result: FetchResult) => {
                    cursor.driverRequested -= result.items.length;
                    cursor.buffer = cursor.buffer.concat(result.items);
                    let finishedAmount = 0;
                    for (const promise of cursor.requestQueue) {
                        if (promise.amount != null) {
                            if (promise.amount <= cursor.buffer.length) {
                                cursor.userRequested -= promise.amount;
                                promise.resolve(cursor.buffer.splice(0, promise.amount));
                            } else {
                                // TODO: Need to request more information
                            }
                        }
                    }
                });
        }
        
        return promise;
    }

    collect(): Promise<any> {
        return this.next(this.remaining);
    }

    private fetchMore(amount?: number) {

    }
    
    /*
    TODO: drop() {

    }
    */
}