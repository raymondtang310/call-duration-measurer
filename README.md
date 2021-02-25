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

**Warning:** If you are executing this code in Internet Explorer, please consider using `invokeWithOptions` and specifying `options.functionCallName` instead. See the documentation including the note on use cases for `invokeWithOptions` below.

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

**Warning:** If you are executing this code in Internet Explorer, please consider using `invokeWithOptions` and specifying `options.functionCallName` instead. See the documentation including the note on use cases for `invokeWithOptions` below.

**Note:** This method is similar to `invoke` but has a key difference in that `invoke` **calls** `func`, whereas `measurify` **returns a function which *upon invocation* calls** `func`.  
In some instances, using `measurify` rather than `invoke` makes your code appear slightly cleaner and more intuitive.
Namely, the scenario arises when there is no meaningful value to pass in for the `scope` parameter but there are `args` to pass to `func`.
See the following code snippet below as an example:
```
// Record the time taken to execute Math.round(1.9) using invoke:
const roundedNumberUsingInvoke = callDurationMeasurer.invoke(Math.round, null, 1.9);

// Record the time taken to execute Math.round(1.9) using measurify:
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
If no `CallDuration`s are recorded, returns an empty array.
The following describes the properties of a `CallDuration` object:

| Property | Description | Type |
|----------|-------------|------|
| name | The name referring to the function call. | string |
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

### `clearCallDurations()`

#### Description
Removes all call durations recorded by this `CallDurationMeasurer`.

#### Return Value
Returns an array containing all `CallDuration`s that were removed from this `CallDurationMeasurer`.
See **Return Value** documentation for `getCallDurations` for details on the properties of a `CallDuration` object.

#### Example
```
const roundedNumber = callDurationMeasurer.measurify(Math.round)(1.9);

const removedCallDurations = callDurationMeasurer.clearCallDurations();
/*
  [
    { name: 'round', duration: 1 },
  ]
 */

const updatedCallDurations = callDurationMeasurer.getCallDurations();
// []
```

<br>

### `invokeWithOptions(func, [options])`

#### Description
Invokes the given function `func` and records the time taken for the call to complete.
If `func` returns a promise, then the time taken for the promise to complete is included in the recorded duration.
This method is similar to `invoke`, but this method offers greater configurability through the `options` object.

#### Arguments
- `func` - The function to invoke.
- `options` - Optional. Options used to configure how `func` is called and/or recorded.

The following describes the properties of an `options` object:

| Property | Description | Type |
|----------|-------------|------|
| functionCallName | Optional. Custom `name` that is used when recording the `CallDuration` for `func`. When unspecified, `func.name` is used. | string |
| scope | Optional. The value to use as `this` when calling `func`. | object |
| args | Optional. Arguments to call `func` with. | array |

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

const messageBuilder = new MessageBuilder('Ann Takamaki');

const message = callDurationMeasurer.invokeWithOptions(messageBuilder.buildMessage, {
  functionCallName: 'messageBuilder.buildMessage',
  scope: messageBuilder,
  args: ['likes', 'sweets'],
});
// 'Ann Takamaki likes sweets'

const callDurations = callDurationMeasurer.getCallDurations();
/*
  [
    { name: 'messageBuilder.buildMessage', duration: 1 },
  ]
 */
```

**Note:** Specifying `options.functionCallName` is helpful whenever you want the recorded name to be different than what `func.name` equals. Use cases include:
- Minifying source code, causing function names to change. For example, source code such as:
    ```
    function someFunctionWithALengthyName() {
      console.log('blah');
    }
    
    callDurationMeasurer.invoke(someFunctionWithALengthyName);
    
    const callDurations = callDurationMeasurer.getCallDurations();
    // [{ name: 'someFunctionWithALengthyName', duration: 1 }]
    ```
    could get compressed to:
    ```
    function f() {
      console.log('blah');
    }
    callDurationMeasurer.invoke(f);
    var callDurations = callDurationMeasurer.getCallDurations();
    // [{ name: 'f', duration: 1 }]
    ```
    In the uncompressed version, the result of `callDurationMeasurer.getCallDurations()` is:
    ```
    [{ name: 'someFunctionWithALengthyName', duration: 1 }]
    ```
    but the result in the compressed version is:
    ```
    [{ name: 'f', duration: 1 }]
    ```
    Using `invokeWithOptions` and explicitly specifying `options.functionCallName` guarantees that the `name` you want will be returned, regardless of minification:
    ```
    function f() {
      console.log('blah');
    }
    callDurationMeasurer.invokeWithOptions(f, { functionCallName: 'someFunctionWithALengthyName' });
    var callDurations = callDurationMeasurer.getCallDurations();
    // [{ name: 'someFunctionWithALengthyName', duration: 1 }]
    ```
- Invoking namespaced functions or methods on objects. Consider the following code snippet for example:
    ```
    class MessageBuilder {
      constructor(baseMessage) {
        this.baseMessage = baseMessage;
      }
    
      buildMessage(subMessage1, subMessage2) {
        return `${this.baseMessage} ${subMessage1} ${subMessage2}`;
      }
    }
    
    const messageBuilder = new MessageBuilder('Makoto Niijima');
    
    const message = callDurationMeasurer.invoke(messageBuilder.buildMessage, messageBuilder, 'is', 'best girl');
    
    const callDurations = callDurationMeasurer.getCallDurations();
    /*
      [
        { name: 'buildMessage', duration: 1 },
      ]
     */
    ```
    As we can see above, the result of `callDurationMeasurer.getCallDurations()` lacks the specificity that `buildMessage` was called on the `messageBuilder` object.
    We can easily include such specificity by using `invokeWithOptions` and specifying `options.functionCallName`:
    ```
    const messageBuilder = new MessageBuilder('Makoto Niijima');

    const message = callDurationMeasurer.invokeWithOptions(messageBuilder.buildMessage, {
      functionCallName: 'messageBuilder.buildMessage',
      scope: messageBuilder,
      args: ['is', 'best girl'],
    });
    
    const callDurations = callDurationMeasurer.getCallDurations();
    /*
      [
        { name: 'messageBuilder.buildMessage', duration: 1 },
      ]
     */
    ```
- Invoking multiple functions with the same name. Consider the following code snippet for example:
    ```
    const { round } = require('lodash');
    
    // Round 1.9 to the nearest integer using Math.round()
    const roundedNumber = callDurationMeasurer.measurify(Math.round)(1.9);
    
    // Round 1.9 to the nearest integer using round() from lodash
    const anotherRoundedNumber = callDurationMeasurer.measurify(round)(1.9);
    
    const callDurations = callDurationMeasurer.getCallDurations();
    /*
      [
        { name: 'round', duration: 1 },
        { name: 'round', duration: 2 },
      ]
     */
    ```
    `callDurationMeasurer.getCallDurations()` above returns two `CallDuration` objects, both with the same `name`.
    To distinguish between the calls to `Math.round` and `round` from `lodash`, we can use `invokeWithOptions` with different values for `options.functionCallName`:
    ```
    const { round } = require('lodash');
    
    // Round 1.9 to the nearest integer using Math.round()
    const roundedNumber = callDurationMeasurer.invokeWithOptions(Math.round, {
      functionCallName: 'Math.round',
      args: [1.9],
    });
    
    // Round 1.9 to the nearest integer using round() from lodash
    const anotherRoundedNumber = callDurationMeasurer.invokeWithOptions(round, {
      functionCallName: 'lodashRound',
      args: [1.9],
    });
    
    const callDurations = callDurationMeasurer.getCallDurations();
    /*
      [
        { name: 'Math.round', duration: 1 },
        { name: 'lodashRound', duration: 2 },
      ]
     */
    ```
- Invoking the same function multiple times. Consider the following code snippet for example:
    ```
    const data = await callDurationMeasurer.measurify(fetch)('http://persona-waifus.com/makoto');
    
    const moreData = await callDurationMeasurer.measurify(fetch)('http://persona-waifus.com/haru');
    
    const callDurations = callDurationMeasurer.getCallDurations();
    /*
      [
        { name: 'fetch', duration: 200 },
        { name: 'fetch', duration: 300 },
      ]
     */
    ```
    `callDurationMeasurer.getCallDurations()` above returns two `CallDuration` objects, both with the same `name`.
    To distinguish between the different calls to `fetch`, we can use `invokeWithOptions` with different values for `options.functionCallName`:
    ```
    const data = await callDurationMeasurer.invokeWithOptions(fetch, {
      functionCallName: 'fetchMakoto',
      args: ['http://persona-waifus.com/makoto'],
    });
    
    const moreData = await callDurationMeasurer.invokeWithOptions(fetch, {
      functionCallName: 'fetchHaru',
      args: ['http://persona-waifus.com/haru'],
    });
    
    const callDurations = callDurationMeasurer.getCallDurations();
    /*
      [
        { name: 'fetchMakoto', duration: 200 },
        { name: 'fetchHaru', duration: 300 },
      ]
     */
    ```
- Running code in Internet Explorer. Unfortunately, the `invoke` and `measurify` methods do not work well in Internet Explorer, due to the `name` property of functions being unsupported:
    ```
    const foo = () => {};
    
    callDurationMeasurer.invoke(foo);
    
    callDurationMeasurer.measurify(Math.round)(1.9);
    
    const callDurations = callDurationMeasurer.getCallDurations();
    /*
      [
        { name: undefined, duration: 1 },
        { name: undefined, duration: 1 },
      ]
     */
    ```
    Using `invokeWithOptions` and specifying `options.functionCallName` will solve this problem:
    ```
    const foo = () => {};
    
    callDurationMeasurer.invokeWithOptions(foo, {
      functionCallName: 'foo',
    });
    
    callDurationMeasurer.invokeWithOptions(Math.round, {
      functionCallName: 'Math.round',
      args: [1.9],
    });
    
    const callDurations = callDurationMeasurer.getCallDurations();
    /*
      [
        { name: 'foo', duration: 1 },
        { name: 'Math.round', duration: 1 },
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
  // Create a new `CallDurationMeasurer`.
  const callDurationMeasurer = new CallDurationMeasurer();

  // Invoke `someFunction` and record the time taken for this call INCLUDING the time taken for the promise to complete.
  await callDurationMeasurer.invoke(someFunction);

  const messagePrinter = new MessagePrinter('Makoto is');
  // Invoke the `printMessages` method on `messagePrinter` with 'best' and 'girl' as arguments, and record the time taken for this call to complete.
  callDurationMeasurer.invoke(messagePrinter.printMessages, messagePrinter, 'best', 'girl');

  // Invoke `someOtherFunction`, passing in 'Hi' as an argument, and record the time taken for this call to complete.. The value of `this` is irrelevant for this function, so `null` is passed in as the `scope` argument.
  callDurationMeasurer.invoke(someOtherFunction, null, 'Hi');

  // Invoke `someOtherFunction`, passing in 'Hello' as an argument, and record the time taken for this call to complete. The `measurify` method (and the function returned by it) is used here as an alternative to the `invoke` method.
  callDurationMeasurer.measurify(someOtherFunction)('Hello');

  // Invoke `printMessages` on `messagePrinter` with 'top' and 'tier' as arguments, and record the time taken for this call to complete. The `invokeWithOptions` method is used here to provide a custom name used in recording this function call.
  callDurationMeasurer.invokeWithOptions(messagePrinter.printMessages, {
    functionCallName: 'printTopTierMessages',
    scope: messagePrinter,
    args: ['top', 'tier'],
  });

  // Retrieve recorded call durations.
  const callDurations = callDurationMeasurer.getCallDurations();

  console.log(callDurations);
  /*
    [
      { name: 'someFunction', duration: 1002 },
      { name: 'printMessages', duration: 5 },
      { name: 'someOtherFunction', duration: 2 },
      { name: 'someOtherFunction', duration: 1 },
      { name: 'printTopTierMessages', duration: 5 },
    ]
   */

  // Remove all recorded call durations.
  callDurationMeasurer.clearCallDurations();

  const updatedCallDurations = callDurationMeasurer.getCallDurations();

  console.log(updatedCallDurations);
  // []

  callDurationMeasurer.measurify(someOtherFunction)('Futaba likes yakisoba');

  // An array containing only the call duration for the most recent call to `someOtherFunction` above is returned due to executing `clearCallDurations()` beforehand.
  const updatedCallDurations2 = callDurationMeasurer.getCallDurations();

  console.log(updatedCallDurations2);
  /*
    [
      { name: 'someOtherFunction', duration: 3 },
    ]
   */
};

main();
```
