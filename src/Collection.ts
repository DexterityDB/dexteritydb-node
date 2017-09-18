import { Dex } from './Dex';
import * as Ops from './Ops';
import { PayloadRequestType, UpdateKind, UpdateKindType, UpdateOps } from './Request';
import { ReadQuery } from './Query';

export class Collection {
    private explain: boolean;

    constructor(public db: Dex, public collectionName: string, { bench = false }: { bench?: boolean } = {}) {
        this.explain = (bench != null ? bench : this.explain);
    }

    get name() {
        return this.collectionName;
    }

    // Sets explain parameter which measures the time it takes for the query to process on the database side
    bench(isOn: boolean = true) {
        return this.options({bench: isOn});
    }

    // Allows mulitple options to be set through a JSON interface
    options(options: Object): Collection {
        return new Collection (this.db, this.collectionName, options);
    }

    // Drop/Remove collection
    drop(): Promise<any> {
        return this.send(PayloadRequestType.RemoveCollection);
    }

    // Create index or make sure it exists
    index(indexName: string): Promise<any> {
        return this.send(PayloadRequestType.EnsureIndex, indexName);
    }

    // Matches a pattern or a ReadOp object
    find(pattern: Ops.ReadOp | Object | null): ReadQuery {
        return new ReadQuery(this, Ops.resolveReadOp(pattern), this.explain); 
    }

    // Inserts an item into the collection
    insert(...items: Object[]): Promise<any> {
        return this.send(PayloadRequestType.Insert, items);
    }

    // Removes items based on a matched pattern
    remove(pattern: Ops.ReadOp | Object | null): Promise<any> {
        return this.send(PayloadRequestType.Remove, this.find_then(pattern));
    }

    // Remove index
    removeIndex(indexName: string): Promise<any> {
        return this.send(PayloadRequestType.RemoveIndex, indexName);
    }

    // Replaces the matched objects with the designated items
    replace(pattern: Ops.ReadOp | Object | null, item: { [key:string]:any; }): Promise<any> {
        return this.send(
            PayloadRequestType.Update,
            new UpdateOps(
                this.find_then(pattern), 
                new UpdateKind(UpdateKindType.Overwrite, item)
            )
        );
    }

    // Updates items in the collection based on match results
    update(pattern: Ops.ReadOp | Object | null, updateFields: { [key:string]:any; }): Promise<any> {
        return this.send(
            PayloadRequestType.Update,
            new UpdateOps(
                this.find_then(pattern),
                new UpdateKind(UpdateKindType.Partial, Ops.convertUpdateObject(updateFields))
            )
        );
    }

    // Used to do pattern matching without find function - for monolithic functions
    private find_then(pattern: Ops.ReadOp | Object | null): any[] {
        let opList: any[] = [];
        const op = Ops.resolveReadOp(pattern);
        if (op != null) {
            op.serialize(opList);
        }
        return opList;
    }

    // Prepares message to be sent
    private send(type: PayloadRequestType, data?: any) {
        return this.db.sendJSON({ type: type, data: data }, this.explain, this.collectionName);
    }
}