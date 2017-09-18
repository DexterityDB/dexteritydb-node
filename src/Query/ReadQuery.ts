import { Collection } from '../Collection';
import * as Ops from '../Ops';
import { Query } from './Query';
import { Op, PayloadRequestType, Projection, ProjectionType, UpdateKind, UpdateKindType, UpdateOps } from '../Request';

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
        return this.send(PayloadRequestType.Fetch, { ops: this.serialize(), projection: projection });
    }

    // Remove items based on matches from ReadQuery 
    remove(): Promise<any> {
        return this.send(PayloadRequestType.Remove, this.serialize());
    }

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
        return this.collection.db.sendJSON({ type: type, data: data }, this.explain, this.collection.collectionName);
    }
}