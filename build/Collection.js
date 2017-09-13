"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ops = require("./Ops");
const Query_1 = require("./Query");
class Collection {
    constructor(db, collectionName) {
        this.db = db;
        this.collectionName = collectionName;
    }
    get name() {
        return this.collectionName;
    }
    // Matches a pattern or a ReadOp object
    find(pattern) {
        return new Query_1.ReadQuery(this, Ops.resolveReadOp(pattern));
    }
    insert() { }
    update() { }
    remove() { }
    ensureIndex() { }
    removeIndex() { }
}
exports.Collection = Collection;
