"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ops = require("./Ops");
const Query_1 = require("./Query");
const Request_1 = require("./Request");
/**
 * Purpose: A Collection object based on the collection that is passed to its constructor
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 *
 */
class Collection {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(db, collectionName, { bench = false } = {}) {
        this.db = db;
        this.collectionName = collectionName;
        this.explain = (bench != null ? bench : this.explain);
    }
    /**
     * Purpose: Returns the name of the collection
     */
    get name() {
        return this.collectionName;
    }
    /**
     * Purpose: Set a parameter that tells the database to bench (or "explain") how long each query takes
     *
     * Example:
     * ```javascript
     * collection.bench().find({ name: "Alex" }).fetch().then((result, t) => {
     *  console.log(result);
     *  console.log(t);
     * });
     * ```
     * @param { boolean } isOn Indicates if parameter should be set or unset
     * @returns { Collection } The same ```Collection``` that called the function, with the modified parameter
     */
    // Sets explain variable
    bench(isOn = true) {
        return this.options({ bench: isOn });
    }
    /**
     * Purpose: Set options for a query
     *
     * Example:
     * ```javascript
     * collection.options({ bench: true });
     * ```
     * Note: Options are being worked on. There will be more in the future...
     * @param { JSON } options A field-value pair that contains one or more options and their desired values
     * @param { boolean } options.bench Sets a parameter that tells the database to bench (or "explain") how long each query takes - same functionality as ```Collection.bench```
     * @returns { Collection } A new ```Collection``` with the desired options set
     */
    // Allows multiple options to be set through a JSON interface
    options(options) {
        return new Collection(this.db, this.collectionName, options);
    }
    /**
     * Purpose: Drop or remove a collection (and its contents) from the database
     *
     * Example:
     * ```javascript
     * await collection.drop();
     * ```
     * @returns { Promise } ```true``` if collection was dropped, ```false``` if unsuccessful
     */
    // Drop/Remove collection
    drop() {
        return this.send(Request_1.PayloadRequestType.RemoveCollection);
    }
    /**
     * Purpose: Index a field. This allows the field to be searchable
     *
     * Example:
     * ```javascript
     * await collection.index("name");
     * ```
     * @param { string } indexName The name of the field to be indexed
     * @returns { Promise } ```true``` if the field was indexed or if it has previously been indexed, ```false``` if unsuccessful
     */
    // Create index or make sure it exists
    index(indexName) {
        return this.send(Request_1.PayloadRequestType.EnsureIndex, indexName);
    }
    /**
     * Purpose: Find a specified pattern in the database. Can be chained with a ReadQuery consumable method
     *
     * Example:
     * ```javascript
     * collection.find({ name: "Dillon" }).fetch().then((result, t) => {
     *  console.log(result);
     *  console.log(t);
     * });
     * ```
     * @param { ReadOp | JSON | null } pattern The pattern that is being searched for; passing ```null``` will return everything in the collection
     * @returns { ReadQuery } A new ```ReadQuery``` that contains the pattern to be searched
     */
    // Matches a pattern or a ReadOp object
    find(pattern) {
        return new Query_1.ReadQuery(this, Ops.resolveReadOp(pattern));
    }
    /**
     * Purpose: Insert one or more items into the collection. Item should be in JSON format or an array of JSON objects
     *
     * Example:
     * ```javascript
     * await collection.insert({ name: "Tom", position: "marketing" }, { name: "Todd", position: "sales"});
     * ```
     * @param { JSON  } items One or more items that should be added to the collection. Can be individual items or an array of items
     * @returns { Promise } ```true``` if the item(s) is successfully inserted, ```false``` if the insert fails
     */
    // Inserts an item into the collection
    insert(...items) {
        if (items.length === 1 && items[0] instanceof Array) {
            return this.send(Request_1.PayloadRequestType.Insert, items[0]);
        }
        else {
            return this.send(Request_1.PayloadRequestType.Insert, items);
        }
    }
    /**
     * Purpose: Remove one or more items in the collection based on a pattern
     *
     * Example:
     * ```javascript
     * await collection.remove("name");
     * ```
     * @param { ReadOp | JSON | null } pattern The pattern that matches the items that should be removed; passing a ```null``` will remove all items in the collection
     * @returns { Promise } ```true``` if the item(s) are successfully removedd, ```false``` if the removal fails
     */
    // Removes items based on a matched pattern
    remove(pattern) {
        return this.send(Request_1.PayloadRequestType.Remove, this.find_then(pattern));
    }
    /**
     * Purpose: Removes the index on a field in the collection
     *
     * Example:
     * ```javascript
     * await collection.removeIndex("name");
     * ```
     * @param { string } indexName The name of the field that should be unindexed
     * @returns { Promise } ```true``` if the index was successfully removed, ```false``` if the removal fails
     */
    // Remove index
    removeIndex(indexName) {
        return this.send(Request_1.PayloadRequestType.RemoveIndex, indexName);
    }
    /**
     * Purpose: Replaces one or more items with a new item
     *
     * Example:
     * ```javascript
     * await collection.replace({ name: "Todd" }, { name: "Tom", age: 23 });
     * ```
     * @param { ReadOp | JSON | null } pattern The pattern to match the items that will be replaced
     * @param { JSON } item The item that will be replacing the matched items
     * @returns { Promise } ```true``` if the replacement was successful, ```false``` if the replacement fails
     */
    // Replaces the matched objects with the designated items
    replace(pattern, item) {
        return this.send(Request_1.PayloadRequestType.Update, new Request_1.UpdateOps(this.find_then(pattern), new Request_1.UpdateKind(Request_1.UpdateKindType.Overwrite, item)));
    }
    /**
     * Purpose: Updates one or more items by changing the value of one or more fields or completely deleting a field or fields from the items
     *
     * Example:
     * ```javascript
     * await collection.update({ name: "Tom" }), { name: "Todd", age: Dex.delete() });
     * ```
     * @param { ReadOp | JSON | null } pattern The pattern to match the items that will be updated
     * @param { JSON } updateFields Field-value pairs that indicate what the new value of the field(s) should be or a ```PartialDelete``` shorthand operator
     * @returns { Promise } ```true``` if the update was successful, ```false``` if the update fails
     */
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
