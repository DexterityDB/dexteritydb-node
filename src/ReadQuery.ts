import { Collection } from './Collection';
import { ReadOp } from './Ops';

export class ReadQuery {
    private collection: Collection;
    private optree: ReadOp;

    constructor(collection: Collection) {

    }

    aggregate() {}
    count() {}
    fetch() {}
    send() {}
    and() {}
    or() {}
}