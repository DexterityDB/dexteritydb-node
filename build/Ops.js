"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = require("./Request");
class ReadOp {
    serialize(opList) {
        throw 'Method called on abstract class!';
    }
}
exports.ReadOp = ReadOp;
class ReadOpPartial {
}
exports.ReadOpPartial = ReadOpPartial;
class ProjectionOpPartial {
    constructor(fields) {
        this.fields = fields;
    }
    resolve() {
        throw 'Method called on abstract class!';
    }
}
exports.ProjectionOpPartial = ProjectionOpPartial;
class UpdateOpPartial {
}
exports.UpdateOpPartial = UpdateOpPartial;
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
    serialize(opList) {
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
        this.field = field;
        if (values.length === 0)
            throw "Empty In operator!";
        this.values = values;
    }
    serialize(opList) {
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
    serialize(opList) {
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
    serialize(opList) {
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
    serialize(opList) {
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
    serialize(opList) {
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
    serialize(opList) {
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
    serialize(opList) {
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
    serialize(opList) {
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
    serialize(opList) {
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
exports.LoadGteLte = LoadGteLte;
class PartialExclude extends ProjectionOpPartial {
    constructor(...fields) { super(fields); }
    resolve() {
        return { type: Request_1.ProjectionType.Exclude, data: this.fields };
    }
}
exports.PartialExclude = PartialExclude;
class PartialInclude extends ProjectionOpPartial {
    constructor(...fields) { super(fields); }
    resolve() {
        return { type: Request_1.ProjectionType.Include, data: this.fields };
    }
}
exports.PartialInclude = PartialInclude;
class PartialDelete extends UpdateOpPartial {
    constructor() { super(); }
}
exports.PartialDelete = PartialDelete;
function convertUpdateObject(obj) {
    let ops = {};
    ops.set = {};
    ops.unset = [];
    for (const field in obj) {
        let value = obj[field];
        switch (value.constructor) {
            case Number:
            case String:
            case Array:
                ops.set[field] = value;
                break;
            case PartialDelete:
                ops.unset.push(field);
                break;
            default:
                throw 'Bad op passed!';
        }
    }
    return ops;
}
exports.convertUpdateObject = convertUpdateObject;
function resolveReadOp(pattern) {
    if (pattern == null || pattern instanceof ReadOp)
        return pattern;
    return convertMatchObject(pattern);
}
exports.resolveReadOp = resolveReadOp;
function convertMatchObject(obj) {
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
        if (ops.length <= 1)
            throw "And operator requires two or more inputs!";
        // Resolve any objects in ops:
        let opList = [];
        for (let i = 0; i < ops.length; i++) {
            // Is object, so convert to a AndOp:
            let op = resolveReadOp(ops[i]);
            if (op == null)
                throw "Bad op!";
            if (op instanceof And) {
                opList.push.apply(opList, op.ops);
            }
            else {
                opList.push(op);
            }
        }
        this.ops = opList;
    }
    serialize(opList) {
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
exports.And = And;
class Or extends ReadOp {
    constructor(...ops) {
        super();
        if (ops.length <= 1)
            throw "Or operator requires two or more inputs!";
        // Resolve any objects in ops:
        let opList = [];
        for (let i = 0; i < ops.length; i++) {
            // Is object, so convert to a AndOp:
            let op = resolveReadOp(ops[i]);
            if (op == null)
                throw "Bad op!";
            if (op instanceof Or) {
                opList.push.apply(opList, op.ops);
            }
            else {
                opList.push(op);
            }
        }
        this.ops = opList;
    }
    serialize(opList) {
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
exports.Or = Or;
