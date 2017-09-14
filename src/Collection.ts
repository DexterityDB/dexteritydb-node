import { Dex } from './Dex';
import * as Ops from './Ops';
import { PayloadRequestType } from './Request';
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
        return this.db.sendJSON({ type: PayloadRequestType.RemoveCollection }, this.explain, this.collectionName);
    }

    // Create index or make sure it exists
    index(indexName: string): Promise<any> {
        return this.db.sendJSON({ type: PayloadRequestType.EnsureIndex, data: indexName }, this.explain, this.collectionName);
    }

    // Matches a pattern or a ReadOp object
    find(pattern: Ops.ReadOp | Object | null): ReadQuery {
        return new ReadQuery(this, Ops.resolveReadOp(pattern), this.explain); 
    }

    // Inserts an item into the collection
    insert(...items: Object[]): Promise<any> {
        return this.db.sendJSON({ type: PayloadRequestType.Insert, data: items }, this.explain, this.collectionName);
    }

    // Removes items based on a matched pattern
    remove(pattern: Ops.ReadOp | Object | null): Promise<any> {
        let opList: any[] = [];
        const op = Ops.resolveReadOp(pattern);
        if (op != null) {
            op.serialize(opList);
        }
        return this.db.sendJSON({ type: PayloadRequestType.Remove, data: opList }, this.explain, this.collectionName);
    }

    // Remove index
    removeIndex(indexName: string): Promise<any> {
        return this.db.sendJSON({ type: PayloadRequestType.RemoveIndex, data: indexName }, this.explain, this.collectionName);
    }

    update() {}
    
}