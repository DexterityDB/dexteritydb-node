"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ops = require("../Ops");
const Query_1 = require("./Query");
const Request_1 = require("../Request");
/**
 * Purpose: A class that represents an in-progress query.
 * A ```ReadQuery``` is chainable so additional methods can be used to modify the query before it is submitted to the database.
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 */
class ReadQuery extends Query_1.Query {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(collection, optree, explain, projection) {
        super(collection, explain);
        this.optree = optree;
        this.projection = projection;
    }
    /**
     * Purpose: A chainable method that allows the user to "And" the current query with one or more additional patterns
     * @param { ReadOp | Object } patterns The additional pattern(s) that will be "And"ed with the existing ```ReadQuery```
     * @returns { ReadQuery } A new ```ReadQuery``` with the new pattern(s) incorporated
     */
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
    /**
     * Purpose: A chainable method that allows the user to "Or" the current query with one or more additional patterns
     * @param { ReadOp | Object } patterns The additional pattern(s) that will be "Or"ed with the existing ```ReadQuery```
     * @returns { ReadQuery } A new ```ReadQuery``` with the new pattern(s) incorporated
     */
    // Applies an Or operator to a chain
    or(...patterns) {
        // If there are no previous results to Or with
        if (this.optree == null)
            return this;
        else {
            return new ReadQuery(this.collection, new Ops.Or(this.optree, ...patterns), this.explain);
        }
    }
    /**
     * Purpose: A consumable method that takes the current ```Query``` and executes it, returning just the number of items in the collection that match the query
     * @returns { Promise } An integer that indicates how many items in the collection that match the query being consumed
     */
    // Count items based on matches from ReadQuery
    count() {
        return this.send(Request_1.PayloadRequestType.Count, this.serialize());
    }
    /**
     * Purpose: A consumable method that takes the current ```Query``` and executes it, returning all of the actual items in the collection that match the query
     * @param { ProjectionOpPartial | string } [fields] A ```PartialOpPartial``` object created using ```Dex.include``` or ```Dex.Exclude```.
     * If one or more ```string```s are passed, the default behavior is to include those fields
     *
     * Note: ```fetch``` will accept multiple ```string``` values or a single ```PartialOpPartial```, **but not both**
     * @returns { Promise } An integer that indicates how many items in the collection that match the query being consumed
     */
    // Fetch items based on matches from ReadQuery
    fetch(...fields) {
        let projection;
        if (fields.length === 0) {
            projection = this.projection;
        }
        else {
            const firstField = fields[0];
            switch (firstField.constructor) {
                case String:
                    projection = { type: Request_1.ProjectionType.Include, data: fields };
                    break;
                case Ops.PartialExclude:
                case Ops.PartialInclude:
                    projection = firstField.resolve();
                    break;
                default:
                    throw 'Bad op passed!';
            }
        }
        return this.send(Request_1.PayloadRequestType.Fetch, { ops: this.serialize(), projection: projection });
    }
    /**
     * Purpose: A consumable method that takes the current ```Query``` and executes it, removing the items found by the query
     * @returns { Promise } ```true``` if the removal was successful, ```false``` if the removal fails
     */
    // Remove items based on matches from ReadQuery 
    remove() {
        return this.send(Request_1.PayloadRequestType.Remove, this.serialize());
    }
    /**
     * Purpose: A consumable method that takes the current ```Query``` and executes it, removing the items found by the query and replacing them with the passed object
     * @param { JSON } item The item that will be replacing the matched items
     * @returns { Promise } ```true``` if the replacement was successful, ```false``` if the replacement fails
     */
    // Replaces the matched objects with the designated items
    replace(item) {
        return this.send(Request_1.PayloadRequestType.Update, new Request_1.UpdateOps(this.serialize(), new Request_1.UpdateKind(Request_1.UpdateKindType.Overwrite, item)));
    }
    /**
     * Purpose: A consumable method that takes the current ```Query``` and executes it, removing the items found by the query and replacing them with the passed object
     * @param { JSON } item Field-value pairs that indicate what the new value of the field(s) should be or a ```PartialDelete``` shorthand operator
     * @returns { Promise } ```true``` if the update was successful, ```false``` if the update fails
     */
    // Updates items in the collection based on previous match results
    update(updateFields) {
        return this.send(Request_1.PayloadRequestType.Update, new Request_1.UpdateOps(this.serialize(), new Request_1.UpdateKind(Request_1.UpdateKindType.Partial, Ops.convertUpdateObject(updateFields))));
    }
    // Serializes the ReadQuery
    serialize() {
        let opList = [];
        if (this.optree != null) {
            this.optree.serialize(opList);
        }
        return opList;
    }
    // Prepares the message to be sent
    send(type, data) {
        return this.collection.db.sendJSON({ type: type, data: data }, this.explain, this.collection.collectionName);
    }
}
exports.ReadQuery = ReadQuery;
