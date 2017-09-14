import { Collection } from '../Collection';

export class Query {
    constructor(public collection: Collection, protected explain: boolean) { }
};