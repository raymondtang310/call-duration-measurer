class CallDurationMeasurer {
  callDurations = [];

  /**
   * Invokes the given callback and records the duration of the call.
   *
   * If the result of the callback is a promise, then:
   * 1. the time taken for the promise to resolve is included in the recorded duration
   * 2. a promise is returned containing the resolved value of the promise returned by the callback
   *
   * Otherwise:
   * 1. the time taken for the callback to run is recorded
   * 2. the result of the callback is returned
   *
   * @param {Function} callback - The function to invoke
   * @param {Object} scope - The value of the "this" keyword provided for the call to the given callback
   * @param {...*} [args] - Arguments with which the given callback should be called
   * @returns {*} If the result of the callback is a promise, returns a promise containing the resolved value of the
   *              promise returned by the callback. Otherwise, returns the result of the callback.
   */
  invoke(callback, scope, ...args) {
    const startTime = new Date();
    let callbackResult;

    if (scope) {
      callbackResult = callback.apply(scope, args);
    } else {
      callbackResult = callback(...args);
    }

    const recordCallbackDuration = data => {
      const endTime = new Date();
      this.callDurations.push({
        name: callback.name,
        duration: endTime - startTime,
      });

      return data;
    };

    return callbackResult instanceof Promise
      ? callbackResult.then(recordCallbackDuration)
      : recordCallbackDuration(callbackResult);
  }

  /**
   * Returns all call durations measured by this {@link CallDurationMeasurer}.
   *
   * @returns {[]} Returns all call durations measured by this {@link CallDurationMeasurer}.
   */
  getCallDurations() {
    return this.callDurations;
  }
}

export default CallDurationMeasurer;
