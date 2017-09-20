export class ExplainResult {
    constructor(public result: any, public explain: any) {}
}

export class PromiseResult<T> extends Promise<T> {
    constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
        super(executor);
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2> {
        if (onfulfilled != null) {
            let callback = onfulfilled as any;
            onfulfilled = (args) => {
                if (args instanceof ExplainResult) {
                    return callback(args.result, args.explain);
                } else {
                    return callback(args);
                }
            }
        }
        return super.then(onfulfilled, onrejected);
    }
}