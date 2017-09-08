"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReadOp {
}
exports.ReadOp = ReadOp;
class ReadOpPartial {
}
exports.ReadOpPartial = ReadOpPartial;
class PartialEq extends ReadOpPartial {
    constructor(value) {
        super();
        this.value = value;
    }
    addField(field) {
        return new LoadEq(field, this.value);
    }
}
exports.PartialEq = PartialEq;
class LoadEq extends ReadOp {
    constructor(field, value) {
        super();
        this.field = field;
        this.value = value;
    }
}
exports.LoadEq = LoadEq;
class PartialIn extends ReadOpPartial {
    constructor(...values) {
        super();
        if (values.length === 0)
            throw "Empty In operator!";
        this.values = values;
    }
    addField(field) {
        return new LoadIn(field, ...this.values);
    }
}
exports.PartialIn = PartialIn;
class LoadIn extends ReadOp {
    constructor(field, ...values) {
        super();
        if (values.length === 0)
            throw "Empty In operator!";
        this.field = field;
        this.values = values;
    }
}
exports.LoadIn = LoadIn;
class PartialLt extends ReadOpPartial {
    constructor(value) {
        super();
        this.value = value;
    }
    addField(field) {
        return new LoadLt(field, this.value);
    }
}
exports.PartialLt = PartialLt;
class LoadLt extends ReadOp {
    constructor(field, value) {
        super();
        this.field = field;
        this.value = value;
    }
}
exports.LoadLt = LoadLt;
class PartialLte extends ReadOpPartial {
    constructor(value) {
        super();
        this.value = value;
    }
    addField(field) {
        return new LoadLte(field, this.value);
    }
}
exports.PartialLte = PartialLte;
class LoadLte extends ReadOp {
    constructor(field, value) {
        super();
        this.field = field;
        this.value = value;
    }
}
exports.LoadLte = LoadLte;
class PartialGt extends ReadOpPartial {
    constructor(value) {
        super();
        this.value = value;
    }
    addField(field) {
        return new LoadGt(field, this.value);
    }
}
exports.PartialGt = PartialGt;
class LoadGt extends ReadOp {
    constructor(field, value) {
        super();
        this.field = field;
        this.value = value;
    }
}
exports.LoadGt = LoadGt;
class PartialGte extends ReadOpPartial {
    constructor(value) {
        super();
        this.value = value;
    }
    addField(field) {
        return new LoadGte(field, this.value);
    }
}
exports.PartialGte = PartialGte;
class LoadGte extends ReadOp {
    constructor(field, value) {
        super();
        this.field = field;
        this.value = value;
    }
}
exports.LoadGte = LoadGte;
class PartialGtLt extends ReadOpPartial {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }
    addField(field) {
        return new LoadGtLt(field, this.start, this.end);
    }
}
exports.PartialGtLt = PartialGtLt;
class LoadGtLt extends ReadOp {
    constructor(field, start, end) {
        super();
        this.field = field;
        this.start = start;
        this.end = end;
    }
}
exports.LoadGtLt = LoadGtLt;
class PartialGteLt extends ReadOpPartial {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }
    addField(field) {
        return new LoadGteLt(field, this.start, this.end);
    }
}
exports.PartialGteLt = PartialGteLt;
class LoadGteLt extends ReadOp {
    constructor(field, start, end) {
        super();
        this.field = field;
        this.start = start;
        this.end = end;
    }
}
exports.LoadGteLt = LoadGteLt;
class PartialGtLte extends ReadOpPartial {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }
    addField(field) {
        return new LoadGtLte(field, this.start, this.end);
    }
}
exports.PartialGtLte = PartialGtLte;
class LoadGtLte extends ReadOp {
    constructor(field, start, end) {
        super();
        this.field = field;
        this.start = start;
        this.end = end;
    }
}
exports.LoadGtLte = LoadGtLte;
class PartialGteLte extends ReadOpPartial {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
    }
    addField(field) {
        return new LoadGteLte(field, this.start, this.end);
    }
}
exports.PartialGteLte = PartialGteLte;
class LoadGteLte extends ReadOp {
    constructor(field, start, end) {
        super();
        this.field = field;
        this.start = start;
        this.end = end;
    }
}
exports.LoadGteLte = LoadGteLte;
function convertObject(obj) {
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
    }
    else if (ops.length === 1) {
        return ops[0];
    }
    else {
        return null;
    }
}
class And extends ReadOp {
    constructor(...ops) {
        super();
        if (ops.length === 0)
            throw "Empty And operator!";
        // Resolve any objects in ops:
        for (let i = 0; i < ops.length; i++) {
            // Check if not ReadOp:
            if (!(ops[i] instanceof ReadOp)) {
                // Is object, so convert to a AndOp:
                let op = convertObject(ops[i]);
                if (op == null)
                    throw "Bad op!";
                ops[i] = op;
            }
        }
        this.ops = ops;
    }
}
exports.And = And;
class Or extends ReadOp {
    constructor(...ops) {
        super();
        if (ops.length === 0)
            throw "Empty Or operator!";
        // Resolve any objects in ops:
        for (let i = 0; i < ops.length; i++) {
            // Check if not ReadOp:
            if (!(ops[i] instanceof ReadOp)) {
                // Is object, so convert to a AndOp:
                let op = convertObject(ops[i]);
                if (op == null)
                    throw "Bad op!";
                ops[i] = op;
            }
        }
        this.ops = ops;
    }
}
exports.Or = Or;
