"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Query {
    constructor(collection, explain = false) {
        this.collection = collection;
        this.explain = explain;
    }
}
exports.Query = Query;
;