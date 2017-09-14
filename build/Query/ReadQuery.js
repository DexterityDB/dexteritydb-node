"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ops = require("../Ops");
const Query_1 = require("./Query");
const Request_1 = require("../Request");
class ReadQuery extends Query_1.Query {
    constructor(collection, optree, explain) {
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
    // Count items based on matches from ReadQuery
    count() {
        return this.send(Request_1.PayloadRequestType.Count);
    }
    // Fetch items based on matches from ReadQuery
    fetch() {
        return this.send(Request_1.PayloadRequestType.Fetch);
    }
    // Remove items based on matches from ReadQuery 
    remove() {
        return this.send(Request_1.PayloadRequestType.Remove);
    }
    serialize() {
        let opList = [];
        if (this.optree != null) {
            this.optree.serialize(opList);
        }
        return opList;
    }
    send(type) {
        const opList = this.serialize();
        return this.collection.db.sendJSON({ type: type, data: opList }, this.explain, this.collection.collectionName);
    }
}
exports.ReadQuery = ReadQuery;
