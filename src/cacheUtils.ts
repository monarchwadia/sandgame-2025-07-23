type GenericFunction = (...args: any[]) => any;

// A list of all cached function parameters, for debugging purposes
export const _fnParamCaches: WeakMap<GenericFunction, Record<string, any>> = new WeakMap();

/**
 * This is a higher-order function that takes a function `cb` and returns a new function that caches results based on the parameters passed.
 * It allows for efficient reuse of results without recomputing them for the same parameters.
 * 
 * @template Fx - The type of the function to be cached.
 * @param cb - The function to be cached.
 * @returns A new function that caches results based on the parameters passed.
 */
export const memoizeByParams = <Fx extends GenericFunction>(cb: Fx): Fx => {
    const paramCache: Record<any, any> = {};
    _fnParamCaches.set(cb, paramCache);

    const cachedFunc = (...args: Parameters<Fx>): ReturnType<Fx> => {
        let curr = paramCache;
        // Traverse/create the cache tree except for the last arg
        for (let i = 0; i < args.length - 1; i++) {
            const arg = args[i];
            if (!(arg in curr)) {
                curr[arg] = {};
            }
            curr = curr[arg];
        }
        const lastArg = args[args.length - 1];
        // Check if result is cached
        if (curr && lastArg in curr) {
            return curr[lastArg];
        }
        // Compute, cache, and return
        const result = cb(...args);
        curr[lastArg] = result;
        return result;
    };
    return cachedFunc as Fx;
}
