import { InvokeOptions, MeasurementResult } from 'types';

/**
 * Invokes the given function `func` and measures the time taken for the call to complete.
 * If `func` returns a promise, then the time taken for the promise to complete is included in the measured duration.
 *
 * @param func - The function to invoke.
 * @param scope - Optional. The value to use as `this` when calling `func`.
 * @param args - Optional. Arguments to call `func` with.
 *
 * @returns If the result of `func` is a promise, returns a promise containing a {@link MeasurementResult}.
 *          Otherwise, returns a {@link MeasurementResult}.
 */
export function invoke<T>(
  func: (...params: unknown[]) => Promise<T>,
  scope?: unknown,
  ...args: unknown[]
): Promise<MeasurementResult<T>>;
/**
 * Invokes the given function `func` and measures the time taken for the call to complete.
 * If `func` returns a promise, then the time taken for the promise to complete is included in the measured duration.
 *
 * @param func - The function to invoke.
 * @param scope - Optional. The value to use as `this` when calling `func`.
 * @param args - Optional. Arguments to call `func` with.
 *
 * @returns If the result of `func` is a promise, returns a promise containing a {@link MeasurementResult}.
 *          Otherwise, returns a {@link MeasurementResult}.
 */
export function invoke<T>(func: (...params: unknown[]) => T, scope?: unknown, ...args: unknown[]): MeasurementResult<T>;
export function invoke<T>(
  func: (...params: unknown[]) => Promise<T> | T,
  scope?: unknown,
  ...args: unknown[]
): Promise<MeasurementResult<T>> | MeasurementResult<T> {
  return invokeWithOptions(func, { scope, args }) as Promise<MeasurementResult<T>> | MeasurementResult<T>;
}

/**
 * Returns a new function that, once invoked, invokes the given function `func` and measures the time taken for the `func` call to complete.
 * If `func` returns a promise, then the time taken for the promise to complete is included in the measured duration.
 * Any arguments that are passed to the function returned by this method will be used to call `func` with.
 *
 * @param func - The function to invoke.
 * @param scope - Optional. The value to use as `this` when calling `func`.
 *
 * @return Returns a new function that:
 *
 *         1) If the result of `func` is a promise, returns a promise containing a {@link MeasurementResult}.
 *
 *         2) Otherwise, returns a {@link MeasurementResult}.
 */
export function measurify<T>(
  func: (...params: unknown[]) => Promise<T>,
  scope?: unknown
): (...args: unknown[]) => Promise<MeasurementResult<T>>;
/**
 * Returns a new function that, once invoked, invokes the given function `func` and measures the time taken for the `func` call to complete.
 * If `func` returns a promise, then the time taken for the promise to complete is included in the measured duration.
 * Any arguments that are passed to the function returned by this method will be used to call `func` with.
 *
 * @param func - The function to invoke.
 * @param scope - Optional. The value to use as `this` when calling `func`.
 *
 * @return Returns a new function that:
 *
 *         1) If the result of `func` is a promise, returns a promise containing a {@link MeasurementResult}.
 *
 *         2) Otherwise, returns a {@link MeasurementResult}.
 */
export function measurify<T>(func: (...params: unknown[]) => T, scope?: unknown): (...args: unknown[]) => MeasurementResult<T>;
export function measurify<T>(
  func: (...params: unknown[]) => Promise<T> | T,
  scope?: unknown
): (...args: unknown[]) => Promise<MeasurementResult<T>> | MeasurementResult<T> {
  return (...args: unknown[]): Promise<MeasurementResult<T>> | MeasurementResult<T> =>
    invokeWithOptions(func, { scope, args }) as Promise<MeasurementResult<T>> | MeasurementResult<T>;
}

/**
 * Invokes the given function `func` and measures the time taken for the call to complete.
 * If `func` returns a promise, then the time taken for the promise to complete is included in the measured duration.
 * This function behaves the same as `invoke` and only differs in function signature:
 * - `invoke` takes in `func`, `scope`, and `args` as separate arguments
 * - `invokeWithOptions` takes in `func` and `options`, and `options` contains properties for `scope` and `args`
 *
 * @param func - The function to invoke.
 * @param options - Optional. Options used to configure how `func` is called.
 * @param options.scope - Optional. The value to use as `this` when calling `func`.
 * @param options.args - Optional. Arguments to call `func` with.
 *
 * @returns If the result of `func` is a promise, returns a promise containing a {@link MeasurementResult}.
 *          Otherwise, returns a {@link MeasurementResult}.
 */
export function invokeWithOptions<T>(
  func: (...params: unknown[]) => Promise<T>,
  options?: InvokeOptions
): Promise<MeasurementResult<T>>;
/**
 * Invokes the given function `func` and measures the time taken for the call to complete.
 * If `func` returns a promise, then the time taken for the promise to complete is included in the measured duration.
 * This function behaves the same as `invoke` and only differs in function signature:
 * - `invoke` takes in `func`, `scope`, and `args` as separate arguments
 * - `invokeWithOptions` takes in `func` and `options`, and `options` contains properties for `scope` and `args`
 *
 * @param func - The function to invoke.
 * @param options - Optional. Options used to configure how `func` is called.
 * @param options.scope - Optional. The value to use as `this` when calling `func`.
 * @param options.args - Optional. Arguments to call `func` with.
 *
 * @returns If the result of `func` is a promise, returns a promise containing a {@link MeasurementResult}.
 *          Otherwise, returns a {@link MeasurementResult}.
 */
export function invokeWithOptions<T>(func: (...params: unknown[]) => T, options?: InvokeOptions): MeasurementResult<T>;
export function invokeWithOptions<T>(
  func: (...params: unknown[]) => Promise<T> | T,
  { scope, args = [] }: InvokeOptions = {
    args: [],
  }
): Promise<MeasurementResult<T>> | MeasurementResult<T> {
  const startTime = new Date();
  const funcResult = scope ? func.apply(scope, args) : func(...args);

  return funcResult instanceof Promise
    ? funcResult.then(data => recordCallDuration(startTime, data))
    : recordCallDuration(startTime, funcResult);
}

function recordCallDuration<T>(startTime: Date, data: T): MeasurementResult<T> {
  const endTime = new Date();
  return { data, duration: endTime.valueOf() - startTime.valueOf() };
}
