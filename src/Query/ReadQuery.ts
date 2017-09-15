import { Collection } from '../Collection';
import * as Ops from '../Ops';
import { Query } from './Query';
import { Op, PayloadRequestType, Projection } from '../Request';

export class ReadQuery extends Query {

    constructor(collection: Collection, private optree: Ops.ReadOp | null, explain: boolean, private projection?: Projection) {
        super(collection, explain);
    }

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

        return new ReadQuery(this.collection, readQuery, this.explain);
    }

    // Applies an Or operator to a chain
    or(...patterns: (Ops.ReadOp | Object)[]): ReadQuery {
        // If there are no previous results to Or with
        if (this.optree == null) return this;
        else {
            return new ReadQuery(this.collection, new Ops.Or(this.optree, ...patterns), this.explain);
        }
    }

    // Count items based on matches from ReadQuery
    count(): Promise<any> {
        return this.send(PayloadRequestType.Count, this.serialize());
    }

    // Fetch items based on matches from ReadQuery
    fetch(): Promise<any> {
        return this.send(PayloadRequestType.Fetch, { ops: this.serialize(), projection: this.projection });
    }

    // Remove items based on matches from ReadQuery 
    remove(): Promise<any> {
        return this.send(PayloadRequestType.Remove, this.serialize());
    }

    private serialize(): Op[] {
        let opList: any[] = [];
        if (this.optree != null) {
            this.optree.serialize(opList);
        }
        return opList;
    }

    private send(type: PayloadRequestType, data: any) {
        return this.collection.db.sendJSON({ type: type, data: data }, this.explain, this.collection.collectionName);
    }
}