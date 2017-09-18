import { Collection } from '../Collection';

export class Query {
    constructor(public collection: Collection, public explain: boolean) { }
};