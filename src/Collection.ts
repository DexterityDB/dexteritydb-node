import { Dex } from './Dex';

export class Collection {
    private db: Dex;
    private collectionName: string;

    constructor(db: Dex, collectionName: string) {
        this.db = db;
        this.collectionName = collectionName;
    }

    find() {}
    insert() {}
    update() {}
    remove() {}
    ensureIndex() {}
    removeIndex() {}
    removeCollection() {}
}