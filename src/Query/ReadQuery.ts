import { Collection } from '../Collection';
import { Cursor } from '../Cursor';
import * as Ops from '../Ops';
import { ExplainResult, PromiseResult } from '../PromiseResult';
import { Query } from './Query';
import { Op, PayloadRequestType, Projection, ProjectionType, UpdateKind, UpdateKindType, UpdateOps } from '../Request';

/**
 * Purpose: A class that represents an in-progress query.
 * A ```ReadQuery``` is chainable so additional methods can be used to modify the query before it is submitted to the database.
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 */
export class ReadQuery extends Query {

    /**
     * **_ Should not be called by the user _**
     */
    constructor(collection: Collection, private optree: Ops.ReadOp | null, private projection?: Projection) {
        super(collection);
    }

    /**
     * Purpose: Set a parameter that tells the database to bench (or "explain") how long each query takes<br>
     * 
     * Example:
     * ```javascript
     * collection.find({ name: "Alex" }).bench().fetchAll().then((results, t) => {
     *  console.log(results);
     *  console.log(t);
     * });
     * ```
     * @param { boolean } isOn Indicates if parameter should be set or unset
     * @returns { ReadQuery } A new ```ReadQuery```, with a reference to a newly created ```Collection``` containing the modified parameter
     */
    // Sets the explain variable on a new Collection object that the new ReadQuery will refer to
    bench(isOn: boolean): ReadQuery {
        const collection = new Collection(this.collection.db, this.collection.collectionName, { bench: isOn });
        return new ReadQuery(collection, this.optree);
    }

    /**
     * Purpose: Set options for a query
     * 
     * Example:
     * ```javascript
     * collection.find({ name: "Alex" }).options({ bench: true });
     * ``` 
     * Note: Options are being worked on. There will be more in the future...
     * @param { JSON } options A field-value pair that contains one or more options and their desired values
     * @param { boolean } options.bench Sets a parameter that tells the database to bench (or "explain") how long each query takes - same functionality as ```Collection.bench```
     * @returns { ReadQuery } A new ```ReadQuery```, with a reference to a newly created ```Collection``` containing the modified parameters
     */
    // Allows multiple options to be set through a JSON interface
    options(options: Object): ReadQuery {
        const collection = new Collection (this.collection.db, this.collection.collectionName, options);
        return new ReadQuery(collection, this.optree);
    }

    /**
     * Purpose: A chainable method that allows the user to "And" the current query with one or more additional patterns
     * 
     * Example:
     * ```javascript
     * collection.find({ name: "Dillon" }).and({ position: "developer" }).fetchAll().then((results) => {
     *  console.log(results);
     * });
     * ```
     * @param { ReadOp | Object } patterns The additional pattern(s) that will be "And"ed with the existing ```ReadQuery```
     * @returns { ReadQuery } A new ```ReadQuery``` with the new pattern(s) incorporated
     */
    // Applies an And operator to a chain
    and(...patterns: (Ops.ReadOp | Object)[]): ReadQuery {
        let readQuery: Ops.ReadOp | null;
        // Check if there are results from the command before
        if (this.optree != null) {
            readQuery = new Ops.And(this.optree, ...patterns);
        } else if (patterns.length === 1) { // If there is only 1 pattern and no previous results
            readQuery = Ops.resolveReadOp(patterns[0]);
            if (readQuery == null) throw "Bad op!";
        } else { // If there are no previous results
            readQuery = new Ops.And(...patterns);
        }

        return new ReadQuery(this.collection, readQuery);
    }

    /**
     * Purpose: A chainable method that allows the user to "Or" the current query with one or more additional patterns
     * 
     * Example:
     * ```javascript
     * collection.find({ name: "Todd" }).or({ name: "Tom" }).fetchAll().then((results) => {
     *  console.log(results);
     * });
     * ```
     * @param { ReadOp | Object } patterns The additional pattern(s) that will be "Or"ed with the existing ```ReadQuery```
     * @returns { ReadQuery } A new ```ReadQuery``` with the new pattern(s) incorporated
     */
    // Applies an Or operator to a chain
    or(...patterns: (Ops.ReadOp | Object)[]): ReadQuery {
        // If there are no previous results to Or with
        if (this.optree == null) return this;
        else {
            return new ReadQuery(this.collection, new Ops.Or(this.optree, ...patterns));
        }
    }

    /**
     * Purpose: A consumable method that takes the current ```Query``` and executes it, returning just the number of items in the collection that match the query
     * 
     * Example:
     * ```javascript
     * collection.find({ name: "Dillon" }).count().then((resultCnt) => {
     *  console.log(resultCnt);
     * });
     * ```
     * @returns { Promise } An integer that indicates how many items in the collection that match the query being consumed
     */
    // Count items based on matches from ReadQuery
    count(): Promise<any> {
        return this.send(PayloadRequestType.Count, this.serialize());
    }

    /**
     * Purpose: A consumable method that takes the current ```Query``` and executes it, returning a ```Cursor``` that can be used to access a stream of the results
     * 
     * Example:
     * ```javascript
     * await const cursor = collection.find({ name: "Dillon" }).fetch();
     * cursor.next().then((results) => {
     *  console.log(results);
     * });
     * ```
     * @param { ProjectionOpPartial | string } [fields] A ```PartialOpPartial``` object created using ```Dex.include``` or ```Dex.exclude```.
     * If one or more ```string```s are passed, the default behavior is to include those fields
     * 
     * Note: ```fetch``` will accept multiple ```string``` values or a single ```PartialOpPartial```, **but not both**
     * @returns { Promise } A ```Cursor``` that can be used to access a stream of results that match the query
     */
    // Fetch items based on matches from ReadQuery
    fetch(...fields: (Ops.ProjectionOpPartial | string)[]): Promise<any> {
        let projection: Projection | undefined;
        if (fields.length === 0) {
            projection = this.projection;
        } else {
            const firstField = fields[0] as any;
            switch (firstField.constructor) {
                case String:
                    projection = { type: ProjectionType.Include, data: fields };
                    break;
                case Ops.PartialExclude:
                case Ops.PartialInclude:
                    projection = firstField.resolve();
                    break;
                default:
                    throw 'Bad op passed!';
            }
        }
        const readQuery = this;
        return new PromiseResult((resolve, reject) => {
            this.send(PayloadRequestType.Fetch, { ops: this.serialize(), projection: projection })
                .then(function (fetchResult) {
                    const explainResult = new ExplainResult(new Cursor(readQuery.collection, fetchResult.cursor, fetchResult.items, arguments[1]), arguments[1]);
                    resolve(explainResult);
                });
        });
    }

    /**
     * Purpose: A consumable method that takes the current ```Query``` and executes it, returning all of the actual items in the collection that match the query
     * 
     * Note: Equivalent to running ```fetch``` and then calling ```Cursor.collect()```
     * 
     * Example:
     * ```javascript
     * collection.find({ name: "Dillon" }).fetchAll().then((results) => {
     *  console.log(results);
     * });
     * ```
     * @param { ProjectionOpPartial | string } [fields] A ```PartialOpPartial``` object created using ```Dex.include``` or ```Dex.exclude```.
     * If one or more ```string```s are passed, the default behavior is to include those fields
     * 
     * Note: ```fetchAll``` will accept multiple ```string``` values or a single ```PartialOpPartial```, **but not both**
     * @returns { Promise } An array of results that match the query
     */
    // Fetch items based on matches from ReadQuery
    fetchAll(...fields: (Ops.ProjectionOpPartial | string)[]): PromiseResult<any> {
        return new PromiseResult((resolve, reject) => {
            this.fetch(...fields).then((cursor: Cursor) => {
                cursor.collect()
                    .then((items) => {
                        const explainResult = new ExplainResult(items, cursor.getBenchResults());
                        resolve(explainResult);
                    });
            });
        });
    }

    /**
     * Purpose: A consumable method that takes the current ```Query``` and executes it, removing the items found by the query
     * 
     * Example:
     * ```javascript
     * await collection.find({ name: "Dillon" }).remove();
     * ``` 
     * @returns { Promise } ```true``` if the removal was successful, ```false``` if the removal fails
     */
    // Remove items based on matches from ReadQuery 
    remove(): Promise<any> {
        return this.send(PayloadRequestType.Remove, this.serialize());
    }

    /**
     * Purpose: A consumable method that takes the current ```Query``` and executes it, removing the items found by the query and replacing them with the passed object
     * 
     * Example:
     * ```javascript
     * await collection.find({ name: "Todd" }).replace( { name: "Tom", age: 23 });
     * ``` 
     * @param { JSON } item The item that will be replacing the matched items
     * @returns { Promise } ```true``` if the replacement was successful, ```false``` if the replacement fails
     */
    // Replaces the matched objects with the designated items
    replace(item: { [key:string]:any; }): Promise<any> {
        return this.send(
            PayloadRequestType.Update,
            new UpdateOps(
                this.serialize(),
                new UpdateKind(
                    UpdateKindType.Overwrite,
                    item
                )
            )
        );
    }

    /**
     * Purpose: A consumable method that takes the current ```Query``` and executes it, removing the items found by the query and replacing them with the passed object
     * 
     * Example:
     * ```javascript
     * await collection.find({ name: "Tom" }).update({ name: "Todd", age: Dex.delete() });
     * ```
     * @param { JSON } item Field-value pairs that indicate what the new value of the field(s) should be or a ```PartialDelete``` shorthand operator
     * @returns { Promise } ```true``` if the update was successful, ```false``` if the update fails
     */
    // Updates items in the collection based on previous match results
    update(updateFields: { [key:string]:any; }): Promise<any> {
        return this.send(
            PayloadRequestType.Update, 
            new UpdateOps(
                this.serialize(),
                new UpdateKind(
                    UpdateKindType.Partial,
                    Ops.convertUpdateObject(updateFields)
                )
            )
        );
    }

    // Serializes the ReadQuery
    private serialize(): Op[] {
        let opList: any[] = [];
        if (this.optree != null) {
            this.optree.serialize(opList);
        }
        return opList;
    }

    // Prepares the message to be sent
    private send(type: PayloadRequestType, data: any) {
        return this.collection.db.sendJSON({ type: type, data: data }, this.collection.explain, this.collection.collectionName);
    }
}