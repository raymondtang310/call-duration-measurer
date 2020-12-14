# call-duration-measurer

call-duration-measurer is a utility for measuring the time it takes for functions/promises to complete.

## Installation
### using npm:
```
npm install call-duration-measurer
```
### using yarn:
```
yarn add call-duration-measurer
```

## API
This package exports a class with the following methods:
```
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
  invoke(callback, scope, ...args)

  /**
   * Returns all call durations recorded by this {@link CallDurationMeasurer}.
   *
   * @returns {[]} Returns all call durations recorded by this {@link CallDurationMeasurer}.
   */
  getCallDurations()
```

## Example Usage
```
const CallDurationMeasurer = require('call-duration-measurer');

const someFunction = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000)
  });
};

class MessagePrinter {
  printMessages(msg1, msg2) {
    console.log(msg1, msg2);
  }
}

const messagePrinter = new MessagePrinter();

const main = async () => {
  const callDurationMeasurer = new CallDurationMeasurer(); // Create a new CallDurationMeasurer.

  await callDurationMeasurer.invoke(someFunction); // Invoke someFunction and record the time taken for the call INCLUDING the time taken for the promise to complete.
  callDurationMeasurer.invoke(messagePrinter.printMessages, messagePrinter, 'Hello', 'Matt'); // Invoke the printMessage function on messagePrinter with "Hello" and "Matt" as arguments,
                                                                                              // and record the time taken for this call to complete.

  const callDurations = callDurationMeasurer.getCallDurations(); // Retrieve recorded call durations.
  console.log(callDurations); // Prints "[{ name: 'someFunction', duration: 1001 }, { name: 'printMessages', duration: 5 }]".
                              // "duration" values may vary slightly between different runs.
};

main();
```
