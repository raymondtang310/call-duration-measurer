/**
 * A `CallDuration` contains data for a completed function call, including a name referring to the function call and the duration of the call.
 */
interface CallDuration {
  /**
   * The name referring to the function call.
   */
  name: string;
  /**
   * The time in milliseconds that it took for the call to complete.
   */
  duration: number;
}

/**
 * Options used to configure how a given function is called and/or recorded.
 */
interface InvokeOptions {
  /**
   * Custom `name` that is used when recording the {@link CallDuration} for a given function.
   */
  functionCallName?: string;
  /**
   * The value to use as `this` when calling a given function.
   */
  scope?: unknown;
  /**
   * Arguments to call a given function with.
   */
  args?: unknown[];
}

/**
 * This class provides functionality for recording the durations of provided functions.
 * For functions that return promises, the time taken for the promise to complete is included in the recorded duration.
 */
class CallDurationMeasurer {
  private callDurations: CallDuration[] = [];

  /**
   * Invokes the given function `func` and records the time taken for the call to complete.
   * If `func` returns a promise, then the time taken for the promise to complete is included in the recorded duration.
   *
   * @param func - The function to invoke.
   * @param scope - Optional. The value to use as `this` when calling `func`.
   * @param args - Optional. Arguments to call `func` with.
   *
   * @returns If the result of `func` is a promise, returns a promise containing the resolved value of the promise returned by `func`.
   *          Otherwise, returns the result of `func`.
   */
  public invoke<T>(func: (...params: unknown[]) => T, scope?: unknown, ...args: unknown[]): T;
  public invoke<T>(func: (...params: unknown[]) => Promise<T>, scope?: unknown, ...args: unknown[]): Promise<T>;
  public invoke<T>(func: (...params: unknown[]) => T | Promise<T>, scope?: unknown, ...args: unknown[]): T | Promise<T> {
    return this.invokeWithOptions(func, { scope, args });
  }

  /**
   * Returns a new function that, once invoked, invokes the given function `func` and records the time taken for the `func` call to complete.
   * If `func` returns a promise, then the time taken for the promise to complete is included in the recorded duration.
   * Any arguments that are passed to the function returned by this method will be used to call `func` with.
   *
   * @param func - The function to invoke.
   * @param scope - Optional. The value to use as `this` when calling `func`.
   *
   * @return Returns a new function that:
   *
   *         1) If the result of `func` is a promise, returns a promise containing the resolved value of the promise returned by `func`.
   *
   *         2) Otherwise, returns the result of `func`.
   */
  public measurify<T>(func: (...params: unknown[]) => T, scope?: unknown): (...args: unknown[]) => T;
  public measurify<T>(func: (...params: unknown[]) => Promise<T>, scope?: unknown): (...args: unknown[]) => Promise<T>;
  public measurify<T>(func: (...params: unknown[]) => T | Promise<T>, scope?: unknown): (...args: unknown[]) => T | Promise<T> {
    return (...args: unknown[]): T | Promise<T> => this.invokeWithOptions(func, { scope, args });
  }

  /**
   * Returns all call durations recorded by this {@link CallDurationMeasurer}.
   *
   * @returns Returns an array containing all {@link CallDuration}s recorded by this {@link CallDurationMeasurer}.
   *          If no {@link CallDuration}s are recorded, returns an empty array.
   */
  public getCallDurations(): ReadonlyArray<CallDuration> {
    return this.callDurations.map(callDuration => ({ ...callDuration }));
  }

  /**
   * Removes all call durations recorded by this {@link CallDurationMeasurer}.
   *
   * @returns Returns an array containing all {@link CallDuration}s that were removed from this {@link CallDurationMeasurer}.
   */
  public clearCallDurations(): ReadonlyArray<CallDuration> {
    const callDurations = this.getCallDurations();
    this.callDurations = [];

    return callDurations;
  }

  /**
   * Invokes the given function `func` and records the time taken for the call to complete.
   * If `func` returns a promise, then the time taken for the promise to complete is included in the recorded duration.
   * This method is similar to `invoke`, but this method offers greater configurability through the `options` object.
   *
   * @param func - The function to invoke.
   * @param options - Optional. Options used to configure how `func` is called and/or recorded.
   * @param options.functionCallName - Optional. Custom `name` that is used when recording the {@link CallDuration} for `func`. When unspecified, `func.name` is used.
   * @param options.scope - Optional. The value to use as `this` when calling `func`.
   * @param options.args - Optional. Arguments to call `func` with.
   *
   * @returns If the result of `func` is a promise, returns a promise containing the resolved value of the promise returned by `func`.
   *          Otherwise, returns the result of `func`.
   */
  public invokeWithOptions<T>(func: (...params: unknown[]) => T, options?: InvokeOptions): T;
  public invokeWithOptions<T>(func: (...params: unknown[]) => Promise<T>, options?: InvokeOptions): Promise<T>;
  public invokeWithOptions<T>(
    func: (...params: unknown[]) => T | Promise<T>,
    { functionCallName = func.name, scope, args = [] }: InvokeOptions = {
      functionCallName: func.name,
      args: [],
    }
  ): T | Promise<T> {
    const startTime = new Date();
    const funcResult = scope ? func.apply(scope, args) : func(...args);

    const recordCallDuration = (data: T): T => {
      const endTime = new Date();
      this.callDurations.push({
        name: functionCallName,
        duration: endTime.valueOf() - startTime.valueOf(),
      });

      return data;
    };

    return funcResult instanceof Promise ? funcResult.then(recordCallDuration) : recordCallDuration(funcResult);
  }
}

export default CallDurationMeasurer;
