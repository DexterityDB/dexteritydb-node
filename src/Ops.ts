import { Projection, ProjectionType, UpdatePartial } from './Request';
import { Value } from './Utils';

/**
 * Purpose: An abstract class that represents a single operator that can be interpreted by the driver.
 * A ```ReadOp``` is created to translate different combinations of patterns into something that the database can understand
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 */
export class ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(){ };

    serialize(opList: any[]): number {
        throw 'Method called on abstract class!';
    }
}

/**
 * Purpose: An abstract class that represents a partial read operator that can be interpreted by the driver.
 * A ```ReadOpPartial``` is created as a placeholder. They get transformed behind the scenes into ```ReadOp```s
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 */
export class ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(){ };
}

/**
 * Purpose: An abstract class that represents a partial projection operator that can be interpreted by the driver.
 * A ```ProjectionOpPartial``` is created as a placeholder. They get transformed behind the scenes to be used in projections.
 * A projection is used during a ```fetch``` to include or exclude specific fields from the items in the result set
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 */
export class ProjectionOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(public fields: string[]) { }

    resolve() {
        throw 'Method called on abstract class!';
    }
 }

 /**
 * Purpose: An abstract class that represents a partial update operator that can be interpreted by the driver.
 * An ```UpdateOpPartial``` is created as a placeholder. They get transformed behind the scenes to be used in item updates
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 */
export class UpdateOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(){ };
}

/**
 * @private
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is equal to the passed value.
 * Created from ```Dex.eq```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
export class PartialEq extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(public value: Value) {
        super();
    }
    addField(field: string) {
        return new LoadEq(field, this.value);
    }
}

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is equal to the passed value
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class LoadEq extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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

/**
 * @private
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is equal to one of the passed values.
 * Created from ```Dex.in```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
export class PartialIn extends ReadOpPartial {
    values: Value[];
    /**
     * **_ Should not be called by the user _**
     */
    constructor(...values: Value[]) {
        super();
        if (values.length === 0) throw "Empty In operator!";
        this.values = values;
    }
    addField(field: string) {
        return new LoadIn(field, ...this.values);
    }
}

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is equal to one of the passed values
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class LoadIn extends ReadOp {
    values: Value[];
    /**
     * **_ Should not be called by the user _**
     */
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

/**
 * @private
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is less than the passed value.
 * Created from ```Dex.lt```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
export class PartialLt extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(public value: Value) {
        super();
    }
    addField(field: string) {
        return new LoadLt(field, this.value);
    }
}

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is less than the passed value
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class LoadLt extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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

/**
 * @private
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is less than or equal to the passed value.
 * Created from ```Dex.lte```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
export class PartialLte extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(public value: Value) {
        super();
    }
    addField(field: string) {
        return new LoadLte(field, this.value);
    }
}

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is less than or equal to the passed value
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class LoadLte extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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

/**
 * @private
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than the passed value.
 * Created from ```Dex.gt```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
export class PartialGt extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(public value: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGt(field, this.value);
    }
}

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than the passed value
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class LoadGt extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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

/**
 * @private
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than the passed value.
 * Created from ```Dex.gte```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
export class PartialGte extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(public value: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGte(field, this.value);
    }
}

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than the passed value
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class LoadGte extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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

/**
 * @private
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than the start value and less than the end value.
 * Created from ```Dex.gtlt```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
export class PartialGtLt extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(public start: Value, public end: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGtLt(field, this.start, this.end);
    }
}

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than the start value and less than the end value
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class LoadGtLt extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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

/**
 * @private
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than or equal to the start value and less than the end value.
 * Created from ```Dex.gtelt```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
export class PartialGteLt extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(public start: Value, public end: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGteLt(field, this.start, this.end);
    }
}

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than or equal to the start value and less than the end value
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class LoadGteLt extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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

/**
 * @private
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than the start value and less than or equal to the end value.
 * Created from ```Dex.gtlte```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
export class PartialGtLte extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(public start: Value, public end: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGtLte(field, this.start, this.end);
    }
}

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than the start value and less than or equal to the end value
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class LoadGtLte extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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

/**
 * @private
 * Purpose: A partial operator used in ```ReadQuery``` to find a value that is greater than or equal to the start value and less than or equal to the end value.
 * Created from ```Dex.gtelte```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOpPartial
 */
export class PartialGteLte extends ReadOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(public start: Value, public end: Value) {
        super();
    }
    addField(field: string) {
        return new LoadGteLte(field, this.start, this.end);
    }
}

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to find a value that is greater than or equal to the start value and less than or equal to the end value
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class LoadGteLte extends ReadOp {
    /**
     * **_ Should not be called by the user _**
     */
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

/**
 * @private
 * Purpose: A partial operator used to exclude specific fields on items returned in a ```fetch```.
 * Created from ```Dex.exclude```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ProjectionOpPartial
 */
export class PartialExclude extends ProjectionOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(...fields: string[]) { super(fields); }

    resolve(): Projection {
        return { type: ProjectionType.Exclude, data: this.fields}
    }
}

/**
 * @private
 * Purpose: A partial operator used to include specific fields on items returned in a ```fetch```.
 * Created from ```Dex.include```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ProjectionOpPartial
 */
export class PartialInclude extends ProjectionOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor(...fields: string[]) { super(fields); }

    resolve(): Projection {
        return { type: ProjectionType.Include, data: this.fields}
    }
}

/**
 * @private
 * Purpose: A partial operator used to remove a field in an update query.
 * Created from ```Dex.delete```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ProjectionOpPartial
 */
export class PartialDelete extends UpdateOpPartial {
    /**
     * **_ Should not be called by the user _**
     */
    constructor() { super(); }
}

export function convertUpdateObject(obj: { [key:string]:any; }): UpdatePartial|null {
    let ops: any = {};
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

export function resolveReadOp(pattern: ReadOp | { [key:string]:any; } | null): ReadOp | null {
    if (pattern == null || pattern instanceof ReadOp) return pattern;
    return convertMatchObject(pattern);
}

function convertMatchObject(obj: { [key:string]:any; }): ReadOp|null {
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

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to combine two or more patterns to be matched.
 * An "And" operator means that all patterns must match the item for it to be included in the result set.
 * Created from ```Dex.and```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class And extends ReadOp {
    ops: ReadOp[];
    /**
     * **_ Should not be called by the user _**
     */
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

/**
 * @private
 * Purpose: A complete ```ReadOp``` used in ```ReadQuery``` to combine two or more patterns to be matched.
 * An "And" operator means that only one pattern must match the item for it to be included in the result set.
 * Created from ```Dex.or```
 * 
 * **_This class is created internally as a result of other methods and should never be constructed directly._**
 * @extends ReadOp
 */
export class Or extends ReadOp {
    ops: ReadOp[];
    /**
     * **_ Should not be called by the user _**
     */
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