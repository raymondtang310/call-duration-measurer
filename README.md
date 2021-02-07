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

### `invoke(func, [scope, ...args])`

#### Description
Invokes the given function `func` and records the time taken for the call to complete.
If `func` returns a promise, then the time taken for the promise to complete is included in the recorded duration.

#### Arguments
- `func` - The function to invoke.
- `scope` - Optional. The value to use as `this` when calling `func`.
- `args` - Optional. Arguments to call `func` with.

#### Return Value
If the result of `func` is a promise, returns a promise containing the resolved value of the promise returned by `func`.
Otherwise, returns the result of `func`.

#### Example
```
class MessageBuilder {
  constructor(baseMessage) {
    this.baseMessage = baseMessage;
  }

  buildMessage(subMessage1, subMessage2) {
    return `${this.baseMessage} ${subMessage1} ${subMessage2}`;
  }
}

const messageBuilder = new MessageBuilder('Haru Okumura');

const message = callDurationMeasurer.invoke(messageBuilder.buildMessage, messageBuilder, 'is', 'rich');
// 'Haru Okumura is rich'
```

<br>

### `measurify(func, [scope])`

#### Description
Returns a new function that, once invoked, invokes the given function `func` and records the time taken for the `func` call to complete.
If `func` returns a promise, then the time taken for the promise to complete is included in the recorded duration.
Any arguments that are passed to the function returned by this method will be used to call `func` with.

**Note:** This method is similar to `invoke` but has a key difference in that `invoke` **calls** `func`, whereas `measurify` **returns a function which *upon invocation* calls** `func`.  
In some instances, using `measurify` rather than `invoke` makes your code appear slightly cleaner and more intuitive.
Namely, the scenario arises when there is no meaningful value to pass in for the `scope` parameter but there are `args` to pass to `func`.
See the following code snippet below as an example:
```
// Record the time taken to execute Math.round(2) using invoke:
const roundedNumberUsingInvoke = callDurationMeasurer.invoke(Math.round, null, 1.9);

// Record the time taken to execute Math.round(2) using measurify:
const roundedNumberUsingMeasurify = callDurationMeasurer.measurify(Math.round)(1.9);
```

#### Arguments
- `func` - The function to invoke once the new function returned by this method is invoked.
- `scope` - Optional. The value to use as `this` when calling `func`.

#### Return Value
Returns a new function that:
1) If the result of `func` is a promise, returns a promise containing the resolved value of the promise returned by `func`.
2) Otherwise, returns the result of `func`.

#### Example
```
const roundedNumber = callDurationMeasurer.measurify(Math.round)(1.9);
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
| duration | The time in milliseconds that it took for the call to complete. | number |

#### Example
```
const roundedNumber = callDurationMeasurer.measurify(Math.round)(1.9);

const callDurations = callDurationMeasurer.getCallDurations();
/*
  [
    { name: 'round', duration: 1 },
  ]
 */

const foo = () => console.log('foo');
callDurationMeasurer.invoke(foo);

const updatedCallDurations = callDurationMeasurer.getCallDurations();
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

  // Invoke `someOtherFunction`, passing in 'Hi' as an argument, and record the time taken for this call to complete.. The value of `this` is irrelevant for this function, so `null` is passed in as the `scope` argument.
  callDurationMeasurer.invoke(someOtherFunction, null, 'Hi');

  // Invoke `someOtherFunction`, passing in 'Hello' as an argument, and record the time taken for this call to complete. The `measurify` method (and the function returned by it) is used here as an alternative to using `invoke`.
  callDurationMeasurer.measurify(someOtherFunction)('Hello');

  // Retrieve recorded call durations.
  const callDurations = callDurationMeasurer.getCallDurations();

  console.log(callDurations);
  /*
    [
      { name: 'someFunction', duration: 1002 },
      { name: 'printMessages', duration: 5 },
      { name: 'someOtherFunction', duration: 1 },
      { name: 'someOtherFunction', duration: 1 },
    ]
   */
};

main();
```
