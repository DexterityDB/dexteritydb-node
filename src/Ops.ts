import { Value } from './Utils';

export class ReadOp { }
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
            case And:
            case Or:
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
    ops: ReadOp;

    constructor(...ops: (ReadOp | Object)[]) {
        super();
        if (ops.length === 0) throw "Empty And operator!";
        // Resolve any objects in ops:
        for (let i = 0; i < ops.length; i++) {
            // Check if not ReadOp:
            if (!(ops[i] instanceof ReadOp)) {
                // Is object, so convert to a AndOp:
                let op = convertObject(ops[i]);
                if (op == null) throw "Bad op!";
                ops[i] = op;
            }
        }
        this.ops = ops;
    }
}

export class Or extends ReadOp {
    ops: ReadOp;

    constructor(...ops: (ReadOp | Object)[]) {
        super();
        if (ops.length === 0) throw "Empty Or operator!";
        // Resolve any objects in ops:
        for (let i = 0; i < ops.length; i++) {
            // Check if not ReadOp:
            if (!(ops[i] instanceof ReadOp)) {
                // Is object, so convert to a AndOp:
                let op = convertObject(ops[i]);
                if (op == null) throw "Bad op!";
                ops[i] = op;
            }
        }
        this.ops = ops;
    }
}