/**
 * A {@link CallDuration} contains data for a completed function call, including the name of the function and the duration of the call.
 */
interface CallDuration {
  /**
   * The name of the function.
   */
  name: string;
  /**
   * The duration in milliseconds that it took for the call to complete.
   */
  duration: number;
}

/**
 * This class provides functionality for recording the durations of provided functions.
 * For functions that return promises, the time taken for the promise to complete is included in the recorded duration.
 */
class CallDurationMeasurer {
  private callDurations: CallDuration[] = [];

  /**
   * Invokes the given function and records the duration of the call.
   * If the given function returns a promise, the time taken for the promise to complete is included in the recorded duration.
   *
   * @param fn - The function to invoke.
   * @param scope - The value of the "this" keyword provided for the call to the given function.
   * @param args - Arguments with which the given function should be called.
   *
   * @returns If the result of the given function is a promise, returns a promise containing the resolved value of the promise
   *          returned by the function. Otherwise, returns the result of the given function.
   */
  public invoke<T>(fn: (...params: unknown[]) => T, scope?: unknown, ...args: unknown[]): T;
  public invoke<T>(fn: (...params: unknown[]) => Promise<T>, scope?: unknown, ...args: unknown[]): Promise<T>;
  public invoke<T>(fn: (...params: unknown[]) => T | Promise<T>, scope?: unknown, ...args: unknown[]): T | Promise<T> {
    const startTime = new Date();
    let fnResult;

    if (scope) {
      fnResult = fn.apply(scope, args);
    } else {
      fnResult = fn(...args);
    }

    const recordCallDuration = (data: T): T => {
      const endTime = new Date();
      this.callDurations.push({
        name: fn.name,
        duration: endTime.valueOf() - startTime.valueOf(),
      });

      return data;
    };

    return fnResult instanceof Promise ? fnResult.then(recordCallDuration) : recordCallDuration(fnResult);
  }

  /**
   * Returns all call durations recorded by this {@link CallDurationMeasurer}.
   *
   * @returns Returns all call durations recorded by this {@link CallDurationMeasurer}.
   */
  public getCallDurations(): Readonly<Readonly<CallDuration>[]> {
    return this.callDurations.map(callDuration => ({ ...callDuration }));
  }
}

export default CallDurationMeasurer;
