import { Dex } from './Dex';
import * as Ops from './Ops';
import { ReadQuery } from './Query';

export class Collection {
    constructor(public db: Dex, public collectionName: string) {}

    get name() {
        return this.collectionName;
    }

    // Matches a pattern or a ReadOp object
    find(pattern: Ops.ReadOp | Object | null): ReadQuery {
        return new ReadQuery(this, Ops.resolveReadOp(pattern)); 
    }

    insert() {}
    update() {}
    remove() {}
    ensureIndex() {}
    removeIndex() {}
}