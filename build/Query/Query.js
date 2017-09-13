"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Query {
    constructor(collection, explain = false) {
        this.collection = collection;
        this.explain = explain;
    }
    bench(isOn = true) {
        this.explain = isOn;
    }
    serialize() {
        throw 'Method called on abstract class!';
    }
}
exports.Query = Query;
;
