# call-duration-measurer

call-duration-measurer is a utility for measuring the time it takes for function calls to complete.
For functions that return promises, the time taken for the promise to complete is included in the recorded duration.

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
This package exports the `CallDurationMeasurer` class:
```
const CallDurationMeasurer = require('call-duration-measurer');

const callDurationMeasurer = new CallDurationMeasurer();
```

The `CallDurationMeasurer` class contains the following methods:

### `invoke(fn, [scope, ...args])`

#### Description
Invokes the given function `fn` and records the duration of the call.
If the given function returns a promise, the time taken for the promise to complete is included in the recorded duration.

#### Arguments
- fn - The function to invoke.
- scope - Optional. The value of the `this` keyword provided for the call to the given function.
- args - Optional. Arguments with which the given function should be called.

#### Return Value
If the result of the given function is a promise, returns a promise containing the resolved value of the promise returned by the function.
Otherwise, returns the result of the given function.

#### Example
```
const roundedNumber = callDurationMeasurer.invoke(Math.round, null, 1.9);
// 2
```

<br>

### `getCallDurations()`

#### Description
Returns all call durations recorded by this `CallDurationMeasurer`.

#### Return Value
Returns an array containing all `CallDuration`s recorded by this `CallDurationMeasurer`.
The following describes the properties of a `CallDuration` object:

| Property | Description | Type |
|----------|-------------|------|
| name | The name of the function. | string |
| duration | The duration in milliseconds that it took for the call to complete. | number |

#### Example
```
const roundedNumber = callDurationMeasurer.invoke(Math.round, null, 1.9);

const foo = () => console.log('foo');

callDurationMeasurer.invoke(foo);

const callDurations = callDurationMeasurer.getCallDurations();
/*
  [
    { name: 'round', duration: 1 },
    { name: 'foo', duration: 1 },
  ]
 */
```

<br>

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

const someOtherFunction = msg => {
  console.log(msg);
};

class MessagePrinter {
  constructor(baseMsg) {
    this.baseMsg = baseMsg;
  }

  printMessages(msg1, msg2) {
    console.log(this.baseMsg, msg1, msg2);
  }
}

const main = async () => {
  // Create a new CallDurationMeasurer.
  const callDurationMeasurer = new CallDurationMeasurer();

  // Invoke `someFunction` and record the time taken for the call INCLUDING the time taken for the promise to complete.
  await callDurationMeasurer.invoke(someFunction);

  const messagePrinter = new MessagePrinter('Makoto is');
  // Invoke the `printMessages` function on `messagePrinter` with 'best' and 'girl' as arguments, and record the time taken for this call to complete.
  callDurationMeasurer.invoke(messagePrinter.printMessages, messagePrinter, 'best', 'girl');

  // Invoke `someOtherFunction`, passing in 'Hi' as an argument. The value of the `this` keyword is irrelevant for this function, so `null` is passed in as the `scope` argument.
  callDurationMeasurer.invoke(someOtherFunction, null, 'Hi');

  // Retrieve recorded call durations.
  const callDurations = callDurationMeasurer.getCallDurations();

  console.log(callDurations);
  /*
    [
      { name: 'someFunction', duration: 1002 },
      { name: 'printMessages', duration: 5 },
      { name: 'someOtherFunction', duration: 1 },
    ]
   */
};

main();
```
