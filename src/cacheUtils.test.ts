import { describe, it, expect, vi } from "vitest";
import { memoizeByParams, _fnParamCaches } from "./cacheUtils";

describe("Cache Utils Test", () => {
    it("should call the cached function", () => {
        const mockFn = vi.fn((a: number, b: number) => a + b);
        const cachedFn = memoizeByParams(mockFn);
        const cache = _fnParamCaches.get(mockFn);
        
        expect(cachedFn(1, 2)).toBe(3);
        expect(mockFn).toHaveBeenCalledOnce();
        
        // Check that cache was populated
        expect(cache).toBeDefined();
        expect(cache![1][2]).toBe(3);
    });

    it("should return cached result on second call with same arguments", () => {
        const mockFn = vi.fn((a: number, b: number) => a + b);
        const cachedFn = memoizeByParams(mockFn);
        const cache = _fnParamCaches.get(mockFn);
        
        // First call
        expect(cachedFn(1, 2)).toBe(3);
        expect(mockFn).toHaveBeenCalledTimes(1);
        
        expect(cache![1][2]).toBe(3);
        
        // Second call with same args - should use cache
        expect(cachedFn(1, 2)).toBe(3);
        expect(mockFn).toHaveBeenCalledTimes(1); // Still only called once
        expect(cache![1][2]).toBe(3); // Cache still has the value
    });

    it("should call function again with different arguments", () => {
        const mockFn = vi.fn((a: number, b: number) => a + b);
        const cachedFn = memoizeByParams(mockFn);
        const cache = _fnParamCaches.get(mockFn);
        
        expect(cachedFn(1, 2)).toBe(3);
        expect(cachedFn(2, 3)).toBe(5);
        expect(mockFn).toHaveBeenCalledTimes(2);
        
        expect(cache![1][2]).toBe(3);
        expect(cache![2][3]).toBe(5);
    });

    it("should work with single argument functions", () => {
        const mockFn = vi.fn((x: number) => x * x);
        const cachedFn = memoizeByParams(mockFn);
        const cache = _fnParamCaches.get(mockFn);
        
        expect(cachedFn(5)).toBe(25);
        expect(cachedFn(5)).toBe(25); // Should use cache
        expect(mockFn).toHaveBeenCalledTimes(1);
        
        expect(cache![5]).toBe(25);
    });

    it("should work with no argument functions", () => {
        const mockFn = vi.fn(() => Math.random());
        const cachedFn = memoizeByParams(mockFn);
        const cache = _fnParamCaches.get(mockFn);
        
        const first = cachedFn();
        const second = cachedFn();
        
        expect(first).toBe(second); // Should return same cached value
        expect(mockFn).toHaveBeenCalledTimes(1);
        
        expect(cache!["undefined"]).toBe(first);
    });

    it("should work with functions that return objects", () => {
        const mockFn = vi.fn((id: number) => ({ id, name: `user-${id}` }));
        const cachedFn = memoizeByParams(mockFn);
        const cache = _fnParamCaches.get(mockFn);
        
        const first = cachedFn(1);
        const second = cachedFn(1);
        
        expect(first).toBe(second); // Should return same object reference
        expect(first).toEqual({ id: 1, name: 'user-1' });
        expect(mockFn).toHaveBeenCalledTimes(1);
        
        expect(cache![1]).toBe(first);
    });

    it("should handle string arguments", () => {
        const mockFn = vi.fn((str: string, num: number) => `${str}-${num}`);
        const cachedFn = memoizeByParams(mockFn);
        const cache = _fnParamCaches.get(mockFn);
        
        expect(cachedFn("hello", 1)).toBe("hello-1");
        expect(cachedFn("hello", 1)).toBe("hello-1"); // Cached
        expect(cachedFn("world", 1)).toBe("world-1"); // Different args
        
        expect(mockFn).toHaveBeenCalledTimes(2);
        
        expect(cache!["hello"][1]).toBe("hello-1");
        expect(cache!["world"][1]).toBe("world-1");
    });

    it("should handle three or more arguments", () => {
        const mockFn = vi.fn((a: number, b: number, c: number) => a + b + c);
        const cachedFn = memoizeByParams(mockFn);
        const cache = _fnParamCaches.get(mockFn);

        // Check that the cache is empty initially
        expect(cache![1]).toBe(undefined)
        expect(cache![1]).toBe(undefined)
        
        // Call with three arguments
        expect(cachedFn(1, 2, 3)).toBe(6);
        expect(cachedFn(1, 2, 3)).toBe(6); // Cached
        expect(cachedFn(1, 2, 4)).toBe(7); // Different last arg
        
        // Check that the function was called only once for each unique set of arguments
        expect(mockFn).toHaveBeenCalledTimes(2);
        
        // Check the cache structure
        expect(cache![1][2][3]).toBe(6);
        expect(cache![1][2][4]).toBe(7);
    });
})