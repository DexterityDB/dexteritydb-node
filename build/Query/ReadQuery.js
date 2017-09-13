"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ops = require("../Ops");
const Request_1 = require("../Request");
const Query_1 = require("./Query");
class ReadQuery extends Query_1.Query {
    constructor(collection, optree, explain = false) {
        super(collection, explain);
        this.optree = optree;
    }
    // Applies an And operator to a chain
    and(...patterns) {
        let readQuery;
        // Check if there are results from the command before
        if (this.optree != null) {
            readQuery = new Ops.And(this.optree, ...patterns);
        }
        else if (patterns.length === 1) {
            readQuery = Ops.resolveReadOp(patterns[0]);
            if (readQuery == null)
                throw "Bad op!";
        }
        else {
            readQuery = new Ops.And(...patterns);
        }
        return new ReadQuery(this.collection, readQuery, this.explain);
    }
    // Applies an Or operator to a chain
    or(...patterns) {
        // If there are no previous results to Or with
        if (this.optree == null)
            return this;
        else {
            return new ReadQuery(this.collection, new Ops.Or(this.optree, ...patterns), this.explain);
        }
    }
    // Serialize the ReadQuery for counting
    count() {
        let opList = [];
        if (this.optree != null) {
            this.optree.serialize(opList);
        }
        return this.collection.db.sendJSON({ type: Request_1.PayloadRequestType.Count, data: opList }, this.explain, this.collection.collectionName);
    }
    // Serialize the ReadQuery for fetching
    fetch() {
        let opList = [];
        if (this.optree != null) {
            this.optree.serialize(opList);
        }
        return this.collection.db.sendJSON({ type: Request_1.PayloadRequestType.Fetch, data: opList }, this.explain, this.collection.collectionName);
    }
    send() { }
}
exports.ReadQuery = ReadQuery;
