"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExplainResult {
    constructor(result, explain) {
        this.result = result;
        this.explain = explain;
    }
}
exports.ExplainResult = ExplainResult;
class PromiseResult extends Promise {
    constructor(executor) {
        super(executor);
    }
    then(onfulfilled, onrejected) {
        if (onfulfilled != null) {
            let callback = onfulfilled;
            onfulfilled = (args) => {
                if (args instanceof ExplainResult) {
                    return callback(args.result, args.explain);
                }
                else {
                    return callback(args);
                }
            };
        }
        if (onrejected != null) {
            let callback = onrejected;
            onrejected = (args) => {
                if (args instanceof ExplainResult) {
                    return callback(args.result, args.explain);
                }
                else {
                    return callback(args);
                }
            };
        }
        return super.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        if (onrejected != null) {
            let callback = onrejected;
            onrejected = (args) => {
                if (args instanceof ExplainResult) {
                    return callback(args.result, args.explain);
                }
                else {
                    return callback(args);
                }
            };
        }
        return super.catch(onrejected);
    }
}
exports.PromiseResult = PromiseResult;
