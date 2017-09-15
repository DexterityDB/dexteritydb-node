"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ops = require("../Ops");
const Query_1 = require("./Query");
const Request_1 = require("../Request");
class ReadQuery extends Query_1.Query {
    constructor(collection, optree, explain, projection) {
        super(collection, explain);
        this.optree = optree;
        this.projection = projection;
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
        return this.send(Request_1.PayloadRequestType.Count, this.serialize());
    }
    // Fetch items based on matches from ReadQuery
    fetch() {
        return this.send(Request_1.PayloadRequestType.Fetch, { ops: this.serialize(), projection: this.projection });
    }
    // Remove items based on matches from ReadQuery 
    remove() {
        return this.send(Request_1.PayloadRequestType.Remove, this.serialize());
    }
    serialize() {
        let opList = [];
        if (this.optree != null) {
            this.optree.serialize(opList);
        }
        return opList;
    }
    send(type, data) {
        return this.collection.db.sendJSON({ type: type, data: data }, this.explain, this.collection.collectionName);
    }
}
exports.ReadQuery = ReadQuery;
