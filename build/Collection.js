"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ops = require("./Ops");
const Request_1 = require("./Request");
const Query_1 = require("./Query");
class Collection {
    constructor(db, collectionName) {
        this.db = db;
        this.collectionName = collectionName;
    }
    get name() {
        return this.collectionName;
    }
    /*
    bench(isOn: boolean = true) {
        return new Query(this, isOn);
    }
    */
    // Drop/Remove collection
    drop() {
        return this.db.sendJSON({ type: Request_1.PayloadRequestType.RemoveCollection }, false, this.collectionName);
    }
    // Create index or make sure it exists
    index(indexName) {
        return this.db.sendJSON({ type: Request_1.PayloadRequestType.EnsureIndex, data: indexName }, false, this.collectionName);
    }
    // Matches a pattern or a ReadOp object
    find(pattern) {
        return new Query_1.ReadQuery(this, Ops.resolveReadOp(pattern));
    }
    // Inserts an item into the collection
    insert(...items) {
        return this.db.sendJSON({ type: Request_1.PayloadRequestType.Insert, data: items }, false, this.collectionName);
    }
    // Removes items based on a matched pattern
    remove(pattern) {
        let opList = [];
        const op = Ops.resolveReadOp(pattern);
        if (op != null) {
            op.serialize(opList);
        }
        return this.db.sendJSON({ type: Request_1.PayloadRequestType.Remove, data: opList }, false, this.collectionName);
    }
    // Remove index
    removeIndex(indexName) {
        return this.db.sendJSON({ type: Request_1.PayloadRequestType.RemoveIndex, data: indexName }, false, this.collectionName);
    }
    update() { }
}
exports.Collection = Collection;
