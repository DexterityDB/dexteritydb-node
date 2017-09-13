import { Collection } from '../Collection';

export class Query {
    constructor(public collection: Collection, public explain: boolean = false) { }

    bench(isOn: boolean = true) {
        this.explain = isOn;
    }

    serialize() {
        throw 'Method called on abstract class!';
    }
};