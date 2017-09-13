import { Dex } from './Dex';
import * as Ops from './Ops';
import { PayloadRequestType } from './Request';
import { Query, ReadQuery } from './Query';

export class Collection {
    constructor(public db: Dex, public collectionName: string) {}

    get name() {
        return this.collectionName;
    }

    /*
    bench(isOn: boolean = true) {
        return new Query(this, isOn);
    }
    */

    // Drop/Remove collection
    drop(): Promise<any> {
        return this.db.sendJSON({ type: PayloadRequestType.RemoveCollection }, false, this.collectionName);
    }

    // Create index or make sure it exists
    index(indexName: string): Promise<any> {
        return this.db.sendJSON({ type: PayloadRequestType.EnsureIndex, data: indexName }, false, this.collectionName);
    }

    // Matches a pattern or a ReadOp object
    find(pattern: Ops.ReadOp | Object | null): ReadQuery {
        return new ReadQuery(this, Ops.resolveReadOp(pattern)); 
    }

    // Inserts an item into the collection
    insert(...items: Object[]): Promise<any> {
        return this.db.sendJSON({ type: PayloadRequestType.Insert, data: items }, false, this.collectionName);
    }

    // Removes items based on a matched pattern
    remove(pattern: Ops.ReadOp | Object | null): Promise<any> {
        let opList: any[] = [];
        const op = Ops.resolveReadOp(pattern);
        if (op != null) {
            op.serialize(opList);
        }
        return this.db.sendJSON({ type: PayloadRequestType.Remove, data: opList }, false, this.collectionName);
    }

    // Remove index
    removeIndex(indexName: string): Promise<any> {
        return this.db.sendJSON({ type: PayloadRequestType.RemoveIndex, data: indexName }, false, this.collectionName);
    }

    update() {}
    
}