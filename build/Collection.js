"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ops = require("./Ops");
const Request_1 = require("./Request");
const Query_1 = require("./Query");
class Collection {
    constructor(db, collectionName, { bench = false } = {}) {
        this.db = db;
        this.collectionName = collectionName;
        this.explain = (bench != null ? bench : this.explain);
    }
    get name() {
        return this.collectionName;
    }
    // Sets explain parameter which measures the time it takes for the query to process on the database side
    bench(isOn = true) {
        return this.options({ bench: isOn });
    }
    // Allows mulitple options to be set through a JSON interface
    options(options) {
        return new Collection(this.db, this.collectionName, options);
    }
    // Drop/Remove collection
    drop() {
        return this.db.sendJSON({ type: Request_1.PayloadRequestType.RemoveCollection }, this.explain, this.collectionName);
    }
    // Create index or make sure it exists
    index(indexName) {
        return this.db.sendJSON({ type: Request_1.PayloadRequestType.EnsureIndex, data: indexName }, this.explain, this.collectionName);
    }
    // Matches a pattern or a ReadOp object
    find(pattern) {
        return new Query_1.ReadQuery(this, Ops.resolveReadOp(pattern), this.explain);
    }
    // Inserts an item into the collection
    insert(...items) {
        return this.db.sendJSON({ type: Request_1.PayloadRequestType.Insert, data: items }, this.explain, this.collectionName);
    }
    // Removes items based on a matched pattern
    remove(pattern) {
        let opList = [];
        const op = Ops.resolveReadOp(pattern);
        if (op != null) {
            op.serialize(opList);
        }
        return this.db.sendJSON({ type: Request_1.PayloadRequestType.Remove, data: opList }, this.explain, this.collectionName);
    }
    // Remove index
    removeIndex(indexName) {
        return this.db.sendJSON({ type: Request_1.PayloadRequestType.RemoveIndex, data: indexName }, this.explain, this.collectionName);
    }
    update() { }
}
exports.Collection = Collection;
