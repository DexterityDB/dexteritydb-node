"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = require("./Request");
/**
 * Purpose: An abstract class that represents a single operator that can be interpreted by the driver.
 * A ```ReadOp``` is created to translate different combinations of patterns into something that the database can understand
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 */
class ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
    constructor() { }
    ;
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
/**
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is equal to the passed value.
 * Created from ```Dex.eq```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
class PartialEq extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(value) {
        super();
        this.value = value;
    }
    addField(field) {
        return new LoadEq(field, this.value);
    }
}
exports.PartialEq = PartialEq;
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is equal to the passed value
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class LoadEq extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is equal to one of the passed values.
 * Created from ```Dex.in```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
class PartialIn extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is equal to one of the passed values
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class LoadIn extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is less than the passed value.
 * Created from ```Dex.lt```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
class PartialLt extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(value) {
        super();
        this.value = value;
    }
    addField(field) {
        return new LoadLt(field, this.value);
    }
}
exports.PartialLt = PartialLt;
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is less than the passed value
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class LoadLt extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is less than or equal to the passed value.
 * Created from ```Dex.lte```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
class PartialLte extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(value) {
        super();
        this.value = value;
    }
    addField(field) {
        return new LoadLte(field, this.value);
    }
}
exports.PartialLte = PartialLte;
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is less than or equal to the passed value
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class LoadLte extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than the passed value.
 * Created from ```Dex.gt```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
class PartialGt extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(value) {
        super();
        this.value = value;
    }
    addField(field) {
        return new LoadGt(field, this.value);
    }
}
exports.PartialGt = PartialGt;
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than the passed value
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class LoadGt extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than the passed value.
 * Created from ```Dex.gte```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
class PartialGte extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(value) {
        super();
        this.value = value;
    }
    addField(field) {
        return new LoadGte(field, this.value);
    }
}
exports.PartialGte = PartialGte;
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than the passed value
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class LoadGte extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than the start value and less than the end value.
 * Created from ```Dex.gtlt```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
class PartialGtLt extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than the start value and less than the end value
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class LoadGtLt extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than or equal to the start value and less than the end value.
 * Created from ```Dex.gtelt```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
class PartialGteLt extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than or equal to the start value and less than the end value
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class LoadGteLt extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than the start value and less than or equal to the end value.
 * Created from ```Dex.gtlte```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
class PartialGtLte extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than the start value and less than or equal to the end value
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class LoadGtLte extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than or equal to the start value and less than or equal to the end value.
 * Created from ```Dex.gtelte```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
class PartialGteLte extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than or equal to the start value and less than or equal to the end value
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class LoadGteLte extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A partial operator used to exclude specific fields on items returned in a ```fetch```.
 * Created from ```Dex.exclude```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ProjectionOpPartial
 */
class PartialExclude extends ProjectionOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(...fields) { super(fields); }
    resolve() {
        return { type: Request_1.ProjectionType.Exclude, data: this.fields };
    }
}
exports.PartialExclude = PartialExclude;
/**
 * Purpose: A partial operator used to include specific fields on items returned in a ```fetch```.
 * Created from ```Dex.include```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ProjectionOpPartial
 */
class PartialInclude extends ProjectionOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(...fields) { super(fields); }
    resolve() {
        return { type: Request_1.ProjectionType.Include, data: this.fields };
    }
}
exports.PartialInclude = PartialInclude;
/**
 * Purpose: A partial operator used to remove a field in an update query.
 * Created from ```Dex.delete```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ProjectionOpPartial
 */
class PartialDelete extends UpdateOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to combine two or more patterns to be matched.
 * An "And" operator means that all patterns must match the item for it to be included in the result set.
 * Created from ```Dex.and```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class And extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
/**
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to combine two or more patterns to be matched.
 * An "And" operator means that only one pattern must match the item for it to be included in the result set.
 * Created from ```Dex.or```
 *
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
class Or extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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
