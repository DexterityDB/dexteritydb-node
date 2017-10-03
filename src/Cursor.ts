import { Value } from './Utils';
import * as Request from './Request';

interface RequestCallback {
    resolve: Function,
    reject: Function,
    amount?: number
}

export class Cursor {
    private id: string;
    private totalSize: number;
    private remaining: number;
    private userRequested: number;
    private driverRequested: number;
    private requestQueue: RequestCallback[] = [];

    constructor(cursor: Request.Cursor, private buffer: Value[] = []) {
        this.id = cursor.id;
        this.remaining = cursor.size;
        this.totalSize = cursor.size + buffer.length;
    }

    getRemaining() {
        return this.remaining;
    }

    next(amount?: number): Promise<any> {
        const cursor = this;
        if (amount == null) {
            if (this.buffer.length >= 1) {
                return new Promise((resolve, reject) => {
                    resolve(cursor.buffer.shift());
                });
            } else {
                return new Promise((resolve, reject) => {
                    cursor.requestQueue.push({ resolve, reject });
                });
            }
        } else {
            if (amount <= this.buffer.length) {
                return new Promise((resolve, reject) => {
                    resolve(cursor.buffer.splice(0, amount));
                });
            } else {
                return new Promise((resolve, reject) => {
                    cursor.requestQueue.push({ resolve, reject, amount });
                });
            }
        }
    }

    collect() {
        
    }

    drop() {

    }

    private fetchMore(amount?: number) {

    }
}