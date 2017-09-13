import { Value } from './Utils';

export class ReadOp {
    serialize(opList: any[]): number {
        throw 'Method called on abstract class!';
    }
}
export class ReadOpPartial { }

export class PartialEq extends ReadOpPartial {
    constructor(public value: Value) {
        super();
    }
    addField(field: string) {
        return new LoadEq(field, this.value);
    }
}

export class LoadEq extends ReadOp {
    constructor(public field: string, public value: Value) {
        super();
    }

    serialize(opList: any[]): number {
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'LoadEq',
            data: {
                field: this.field,
                value: this.value
            }
        });
        return insertIndex;
    }
}

export class PartialIn extends ReadOpPartial {
    values: Value[];

    constructor(...values: Value[]) {
        super();
        if (values.length === 0) throw "Empty In operator!";
        this.values = values;
    }
    addField(field: string) {
        return new LoadIn(field, ...this.values);
    }
}

export class LoadIn extends ReadOp {
    values: Value[];

    constructor(public field: string, ...values: Value[]) {
        super();
        if (values.length === 0) throw "Empty In operator!";
        this.values = values;
    }

    serialize(opList: any[]): number {
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'LoadIn',
            data: {
                field: this.field,
                values: this.values
            }
        });
        return insertIndex;
    }
}

export class PartialLt extends ReadOpPartial {
    constructor(public value: Value) {
        super();
    }
    addField(field: string) {
        return new LoadLt(field, this.value);
    }
}

export class LoadLt extends ReadOp {
    constructor(public field: string, public value: Value) {
        super();
    }

    serialize(opList: any[]): number {
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'LoadLt',
            data: {
                field: this.field,
                value: this.value
            }
        });
        return insertIndex;
    }
}

export class PartialLte extends ReadOpPartial {
    constructor(public value: Value) {
        super();
    }
    addField(field: string) {
        return new LoadLte(field, this.value);
    }
}

export class LoadLte extends ReadOp {
    constructor(public field: string, public value: Value) {
        super();
    }

    serialize(opList: any[]): number {
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'LoadLte',
            data: {
                field: this.field,
                value: this.value
            }
        });
        return insertIndex;
    }
}

export class PartialGt extends ReadOpPartial {
    constructor(public value: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGt(field, this.value);
    }
}

export class LoadGt extends ReadOp {
    constructor(public field: string, public value: Value) {
        super();
    }

    serialize(opList: any[]): number {
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'LoadGt',
            data: {
                field: this.field,
                value: this.value
            }
        });
        return insertIndex;
    }
}

export class PartialGte extends ReadOpPartial {
    constructor(public value: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGte(field, this.value);
    }
}

export class LoadGte extends ReadOp {
    constructor(public field: string, public value: Value) {
        super();
    }

    serialize(opList: any[]): number {
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'LoadGte',
            data: {
                field: this.field,
                value: this.value
            }
        });
        return insertIndex;
    }
}

export class PartialGtLt extends ReadOpPartial {
    constructor(public start: Value, public end: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGtLt(field, this.start, this.end);
    }
}

export class LoadGtLt extends ReadOp {
    constructor(public field: string, public start: Value, public end: Value) {
        super();
    }

    serialize(opList: any[]): number {
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'LoadGtLt',
            data: {
                field: this.field,
                low: this.start,
                high: this.end
            }
        });
        return insertIndex;
    }
}

export class PartialGteLt extends ReadOpPartial {
    constructor(public start: Value, public end: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGteLt(field, this.start, this.end);
    }
}

export class LoadGteLt extends ReadOp {
    constructor(public field: string, public start: Value, public end: Value) {
        super();
    }

    serialize(opList: any[]): number {
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'LoadGteLt',
            data: {
                field: this.field,
                low: this.start,
                high: this.end
            }
        });
        return insertIndex;
    }
}

export class PartialGtLte extends ReadOpPartial {
    constructor(public start: Value, public end: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGtLte(field, this.start, this.end);
    }
}

export class LoadGtLte extends ReadOp {
    constructor(public field: string, public start: Value, public end: Value) {
        super();
    }

    serialize(opList: any[]): number {
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'LoadGtLte',
            data: {
                field: this.field,
                low: this.start,
                high: this.end
            }
        });
        return insertIndex;
    }
}

export class PartialGteLte extends ReadOpPartial {
    constructor(public start: Value, public end: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGteLte(field, this.start, this.end);
    }
}

export class LoadGteLte extends ReadOp {
    constructor(public field: string, public start: Value, public end: Value) {
        super();
    }

    serialize(opList: any[]): number {
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'LoadGteLte',
            data: {
                field: this.field,
                low: this.start,
                high: this.end
            }
        });
        return insertIndex;
    }
}

export function resolveReadOp(pattern: ReadOp | { [key:string]:any; } | null): ReadOp | null {
    if (pattern == null) return null;
    return pattern instanceof ReadOp ? pattern : convertObject(pattern);
}

function convertObject(obj: { [key:string]:any; }): ReadOp|null {
    let ops = [];
    for (const field in obj) {
        let value = obj[field];
        switch (value.constructor) {
            case Number:
            case String:
                value = new LoadEq(field, value);
                break;
            case Array:
                value = new LoadIn(field, ...value);
                break;
            case PartialEq:
            case PartialIn:
            case PartialLt:
            case PartialLte:
            case PartialGt:
            case PartialGte:
            case PartialGtLt:
            case PartialGteLt:
            case PartialGtLte:
            case PartialGteLte:
                value = value.addField(field);
                break;
            default:
                throw "Bad op passed!";
        }
        ops.push(value); // Pushes the now parsed op
    }

    // Return ReadOp|null based on the ops:
    if (ops.length > 1) {
        return new And(...ops);
    } else if (ops.length === 1) {
        return ops[0];
    } else {
        return null;
    }
}

export class And extends ReadOp {
    ops: ReadOp[];

    constructor(...ops: (ReadOp | Object)[]) {
        super();
        if (ops.length <= 1) throw "And operator requires two or more inputs!";
        // Resolve any objects in ops:
        let opList = [];
        for (let i = 0; i < ops.length; i++) {
            // Is object, so convert to a AndOp:
            let op = resolveReadOp(ops[i]);
            if (op == null) throw "Bad op!";
            if (op instanceof And) {
                opList.push.apply(opList, op.ops);
            } else {
                opList.push(op);
            }
        }
        this.ops = opList;
    }
    
    serialize(opList: any[]): number {
        // Keep track of indexes for the And parameters
        let opIndexes = [];
        for (let op of this.ops) {
            opIndexes.push(op.serialize(opList));
        }
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'And',
            data: opIndexes
        });
        return insertIndex;
    }
}

export class Or extends ReadOp {
    ops: ReadOp[];

    constructor(...ops: (ReadOp | Object)[]) {
        super();
        if (ops.length <= 1) throw "Or operator requires two or more inputs!";
        // Resolve any objects in ops:
        let opList = [];
        for (let i = 0; i < ops.length; i++) {
            // Is object, so convert to a AndOp:
            let op = resolveReadOp(ops[i]);
            if (op == null) throw "Bad op!";
            if (op instanceof Or) {
                opList.push.apply(opList, op.ops);
            } else {
                opList.push(op);
            }
        }
        this.ops = opList;
    }
    
    serialize(opList: any[]): number {
        // Keep track of indexes for the Or parameters
        let opIndexes = [];
        for (let op of this.ops) {
            opIndexes.push(op.serialize(opList));
        }
        // The index where the new item will be in the opList
        const insertIndex = opList.length;
        opList.push({
            type: 'Or',
            data: opIndexes
        });
        return insertIndex;
    }
}