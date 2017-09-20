"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ops = require("./Ops");
const Query_1 = require("./Query");
const Request_1 = require("./Request");
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
        return this.send(Request_1.PayloadRequestType.RemoveCollection);
    }
    // Create index or make sure it exists
    index(indexName) {
        return this.send(Request_1.PayloadRequestType.EnsureIndex, indexName);
    }
    // Matches a pattern or a ReadOp object
    find(pattern) {
        return new Query_1.ReadQuery(this, Ops.resolveReadOp(pattern), this.explain);
    }
    // Inserts an item into the collection
    insert(...items) {
        return this.send(Request_1.PayloadRequestType.Insert, items);
    }
    // Removes items based on a matched pattern
    remove(pattern) {
        return this.send(Request_1.PayloadRequestType.Remove, this.find_then(pattern));
    }
    // Remove index
    removeIndex(indexName) {
        return this.send(Request_1.PayloadRequestType.RemoveIndex, indexName);
    }
    // Replaces the matched objects with the designated items
    replace(pattern, item) {
        return this.send(Request_1.PayloadRequestType.Update, new Request_1.UpdateOps(this.find_then(pattern), new Request_1.UpdateKind(Request_1.UpdateKindType.Overwrite, item)));
    }
    // Updates items in the collection based on match results
    update(pattern, updateFields) {
        return this.send(Request_1.PayloadRequestType.Update, new Request_1.UpdateOps(this.find_then(pattern), new Request_1.UpdateKind(Request_1.UpdateKindType.Partial, Ops.convertUpdateObject(updateFields))));
    }
    // Used to do pattern matching without find function - for monolithic functions
    find_then(pattern) {
        let opList = [];
        const op = Ops.resolveReadOp(pattern);
        if (op != null) {
            op.serialize(opList);
        }
        return opList;
    }
    // Prepares message to be sent
    send(type, data) {
        return this.db.sendJSON({ type: type, data: data }, this.explain, this.collectionName);
    }
}
exports.Collection = Collection;
