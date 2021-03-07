# call-duration-measurer

`call-duration-measurer` is a utility for measuring the time it takes for function calls to complete.
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

### `CallDurationMeasurer`
The `call-duration-measurer` package exports the `CallDurationMeasurer` class:
```
import { CallDurationMeasurer } from 'call-duration-measurer';

const callDurationMeasurer = new CallDurationMeasurer();
```

The `CallDurationMeasurer` class provides a stateful way to measure and record the call durations of given functions.
This is particularly useful when working with code that includes several function calls that you want to measure and keep track of.

#### How to import (recommended):
- Root level named import using ES6 `import` (**best for minimizing bundle size due to tree-shaking support**):
    ```
    import { CallDurationMeasurer } from 'call-duration-measurer';
    ```
- Root level named import using CommonJS `require`:
    ```
    const { CallDurationMeasurer } = require('call-duration-measurer');
    ```

#### Other ways to import (not recommended*):
- Subfolder import from ES6 module using ES6 `import`:
    ```
    import CallDurationMeasurer from 'call-duration-measurer/esm/CallDurationMeasurer';
    ```
- Subfolder import from UMD module using ES6 `import`:
    ```
    import CallDurationMeasurer from 'call-duration-measurer/CallDurationMeasurer';
    ```
- Subfolder import using CommonJS `require`:
    ```
    const CallDurationMeasurer = require('call-duration-measurer/CallDurationMeasurer').default;
    ```
__*__ These import strategies are not recommended due to having either neglible or heavier impacts to bundle size for consuming applications in comparison to the recommended import strategies, coupled with having subjectively uglier import statements.

The `CallDurationMeasurer` class contains the following methods:

#### `invoke(func, [scope, ...args])`

##### Description
Invokes the given function `func` and records the time taken for the call to complete.
If `func` returns a promise, then the time taken for the promise to complete is included in the recorded duration.

**Warning:** If you are executing this code in Internet Explorer, please consider using `invokeWithOptions` and specifying `options.functionCallName` instead. See the documentation including the note on use cases for `invokeWithOptions` below.

##### Arguments
- `func` - The function to invoke.
- `scope` - Optional. The value to use as `this` when calling `func`.
- `args` - Optional. Arguments to call `func` with.

##### Return Value
If the result of `func` is a promise, returns a promise containing the resolved value of the promise returned by `func`.
Otherwise, returns the result of `func`.

##### Example
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

#### `measurify(func, [scope])`

##### Description
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
// 2

// Record the time taken to execute Math.round(1.9) using measurify:
const roundedNumberUsingMeasurify = callDurationMeasurer.measurify(Math.round)(1.9);
// 2
```

##### Arguments
- `func` - The function to invoke once the new function returned by this method is invoked.
- `scope` - Optional. The value to use as `this` when calling `func`.

##### Return Value
Returns a new function that:
1) If the result of `func` is a promise, returns a promise containing the resolved value of the promise returned by `func`.
2) Otherwise, returns the result of `func`.

##### Example
```
const roundedNumber = callDurationMeasurer.measurify(Math.round)(1.9);
// 2
```

<br>

#### `getCallDurations()`

##### Description
Returns all call durations recorded by this `CallDurationMeasurer`.

##### Return Value
Returns an array containing all `CallDuration`s recorded by this `CallDurationMeasurer`.
If no `CallDuration`s are recorded, returns an empty array.

The following describes the properties of a `CallDuration` object:

| Property | Description | Type |
|----------|-------------|------|
| name | The name referring to the function call. | string |
| duration | The time in milliseconds that it took for the call to complete. | number |

##### Example
```
const roundedNumber = callDurationMeasurer.measurify(Math.round)(1.9);
// 2

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

#### `clearCallDurations()`

##### Description
Removes all call durations recorded by this `CallDurationMeasurer`.

##### Return Value
Returns an array containing all `CallDuration`s that were removed from this `CallDurationMeasurer`.
See **Return Value** documentation for `getCallDurations` for details on the properties of a `CallDuration` object.

##### Example
```
const roundedNumber = callDurationMeasurer.measurify(Math.round)(1.9);
// 2

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

#### `invokeWithOptions(func, [options])`

##### Description
Invokes the given function `func` and records the time taken for the call to complete.
If `func` returns a promise, then the time taken for the promise to complete is included in the recorded duration.
This method is similar to `invoke`, but this method offers greater configurability through the `options` object.

##### Arguments
- `func` - The function to invoke.
- `options` - Optional. Options used to configure how `func` is called and/or recorded.

The following describes the properties of an `options` object:

| Property | Description | Type |
|----------|-------------|------|
| functionCallName | Optional. Custom `name` that is used when recording the `CallDuration` for `func`. When unspecified, `func.name` is used. | string |
| scope | Optional. The value to use as `this` when calling `func`. | object |
| args | Optional. Arguments to call `func` with. | array |

##### Return Value
If the result of `func` is a promise, returns a promise containing the resolved value of the promise returned by `func`.
Otherwise, returns the result of `func`.

##### Example
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

### Inline Measuring
The `call-duration-measurer` package also exports multiple standalone measuring functions that return/resolve measured durations:
```
import { invoke, measurify, invokeWithOptions } from 'call-duration-measurer';
```

Whereas the `CallDurationMeasurer` class is helpful for keeping a history of call durations, these inline measuring functions are useful for stateless one-off call duration measurements.

#### How to import (recommended):
- Root level named imports using ES6 `import` (**best for minimizing bundle size due to tree-shaking support**):
    ```
    import { invoke, measurify, invokeWithOptions } from 'call-duration-measurer';
    ```
- Root level named imports using CommonJS `require`:
    ```
    const { invoke, measurify, invokeWithOptions } = require('call-duration-measurer');
    ```

#### Other ways to import (not recommended*):
- Subfolder named imports from ES6 module using ES6 `import`:
    ```
    import { invoke, measurify, invokeWithOptions } from 'call-duration-measurer/esm/inlineMeasurer';
    ```
- Subfolder named imports from UMD module using ES6 `import`:
    ```
    import { invoke, measurify, invokeWithOptions } from 'call-duration-measurer/inlineMeasurer';
    ```
- Subfolder named imports using CommonJS `require`:
    ```
    const { invoke, measurify, invokeWithOptions } = require('call-duration-measurer/inlineMeasurer');
    ```
- Subfolder single object import containing all functions from ES6 module using ES6 `import`:
    ```
    import * as inlineMeasurer from 'call-duration-measurer/esm/inlineMeasurer';
    // inlineMeasurer.invoke(...)
    // inlineMeasurer.measurify(...)
    // inlineMeasurer.invokeWithOptions(...)
    ```
- Subfolder single object import containing all functions from UMD module using ES6 `import`:
    ```
    import * as inlineMeasurer from 'call-duration-measurer/inlineMeasurer';
    // inlineMeasurer.invoke(...)
    // inlineMeasurer.measurify(...)
    // inlineMeasurer.invokeWithOptions(...)
    ```
- Subfolder single object import containing all functions using CommonJS `require`:
    ```
    const inlineMeasurer = require('call-duration-measurer/inlineMeasurer');
    // inlineMeasurer.invoke(...)
    // inlineMeasurer.measurify(...)
    // inlineMeasurer.invokeWithOptions(...)
    ```
__*__ These import strategies are not recommended due to having either neglible or heavier impacts to bundle size for consuming applications in comparison to the recommended import strategies, coupled with having subjectively uglier import statements.

This package supports the following inline measuring functions:

#### `invoke(func, [scope, ...args])`

##### Description
Invokes the given function `func` and records the time taken for the call to complete.
If `func` returns a promise, then the time taken for the promise to complete is included in the recorded duration.

##### Arguments
- `func` - The function to invoke.
- `scope` - Optional. The value to use as `this` when calling `func`.
- `args` - Optional. Arguments to call `func` with.

##### Return Value
If the result of `func` is a promise, returns a promise containing a `MeasurementResult`.
Otherwise, returns a `MeasurementResult`.

The following describes the properties of a `MeasurementResult` object:

| Property | Description | Type |
|----------|-------------|------|
| data | If `func` returns a promise: the resolved value of the promise returned by `func`.<br>Otherwise: the result of `func`. | any |
| duration | The time in milliseconds that it took for the call to complete. | number |

##### Example
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

const { data, duration } = invoke(messageBuilder.buildMessage, messageBuilder, 'is', 'rich');
// { data: 'Haru Okumura is rich', duration: 1 }
```

<br>

#### `measurify(func, [scope])`

##### Description
Returns a new function that, once invoked, invokes the given function `func` and measures the time taken for the `func` call to complete.
If `func` returns a promise, then the time taken for the promise to complete is included in the measured duration.
Any arguments that are passed to the function returned by this method will be used to call `func` with.

**Note:** This function is similar to `invoke` but has a key difference in that `invoke` **calls** `func`, whereas `measurify` **returns a function which *upon invocation* calls** `func`.  
In some instances, using `measurify` rather than `invoke` makes your code appear slightly cleaner and more intuitive.
Namely, the scenario arises when there is no meaningful value to pass in for the `scope` parameter but there are `args` to pass to `func`.
See the following code snippet below as an example:
```
// Measure the time taken to execute Math.round(1.9) using invoke:
const measurementResultUsingInvoke = invoke(Math.round, null, 1.9);
// { data: 2, duration: 1 }

// Measure the time taken to execute Math.round(1.9) using measurify:
const measurementResultUsingMeasurify = measurify(Math.round)(1.9);
// { data: 2, duration: 1 }
```

##### Arguments
- `func` - The function to invoke once the new function returned by this method is invoked.
- `scope` - Optional. The value to use as `this` when calling `func`.

##### Return Value
Returns a new function that:
1) If the result of `func` is a promise, returns a promise containing a `MeasurementResult`.
2) Otherwise, returns a `MeasurementResult`.

See **Return Value** documentation for `invoke` for details on the properties of a `MeasurementResult` object.

##### Example
```
const { data, duration } = measurify(Math.round)(1.9);
// { data: 2, duration: 1 }
```

<br>

#### `invokeWithOptions(func, [options])`

##### Description
Invokes the given function `func` and measures the time taken for the call to complete.
If `func` returns a promise, then the time taken for the promise to complete is included in the measured duration.
This function behaves the same as `invoke` and only differs in function signature:
- `invoke` takes in `func`, `scope`, and `args` as separate arguments
- `invokeWithOptions` takes in `func` and `options`, and `options` contains properties for `scope` and `args`

##### Arguments
- `func` - The function to invoke.
- `options` - Optional. Options used to configure how `func` is called.

The following describes the properties of an `options` object:

| Property | Description | Type |
|----------|-------------|------|
| scope | Optional. The value to use as `this` when calling `func`. | object |
| args | Optional. Arguments to call `func` with. | array |

##### Return Value
If the result of `func` is a promise, returns a promise containing a `MeasurementResult`.
Otherwise, returns a `MeasurementResult`.

See **Return Value** documentation for `invoke` for details on the properties of a `MeasurementResult` object.

##### Example
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

const { data, duration } = invokeWithOptions(messageBuilder.buildMessage, {
  scope: messageBuilder,
  args: ['likes', 'sweets'],
});
// { data: 'Ann Takamaki likes sweets', duration: 1 }
```

<br>

## Example Usage

### Stateful call duration measuring:
```
import { CallDurationMeasurer } from 'call-duration-measurer';

const someFunctionThatReturnsAPromise = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Resolved value!');
    }, 1000)
  });
};

const greet = name => {
  return `Hi, ${name}`;
};

class MessageBuilder {
  constructor(baseMessage) {
    this.baseMessage = baseMessage;
  }

  buildMessage(subMessage1, subMessage2) {
    return `${this.baseMessage} ${subMessage1} ${subMessage2}`;
  }
}

const main = async () => {
  // Create a new `CallDurationMeasurer`.
  const callDurationMeasurer = new CallDurationMeasurer();

  // Invoke `someFunctionThatReturnsAPromise` and record the time taken for this call INCLUDING the time taken for the promise to complete.
  const result1 = await callDurationMeasurer.invoke(someFunctionThatReturnsAPromise);
  console.log(result1);
  // 'Resolved Value!'

  const messageBuilder = new MessageBuilder('Makoto is');
  // Invoke the `buildMessage` method on `messageBuilder` with 'best' and 'girl' as arguments, and record the time taken for this call to complete.
  const result2 = callDurationMeasurer.invoke(messageBuilder.buildMessage, messageBuilder, 'best', 'girl');
  console.log(result2);
  // 'Makoto is best girl'

  // Invoke `greet`, passing in 'Ann' as an argument, and record the time taken for this call to complete. The value of `this` is irrelevant for this function, so `null` is passed in as the `scope` argument.
  const result3 = callDurationMeasurer.invoke(greet, null, 'Ann');
  console.log(result3);
  // 'Hi, Ann'

  // Invoke `greet`, passing in 'Kasumi' as an argument, and record the time taken for this call to complete. The `measurify` method (and the function returned by it) is used here as an alternative to the `invoke` method.
  const result4 = callDurationMeasurer.measurify(greet)('Kasumi');
  console.log(result4);
  // 'Hi, Kasumi'

  // Invoke the `buildMessage` method on `messageBuilder` with 'top' and 'tier' as arguments, and record the time taken for this call to complete. The `invokeWithOptions` method is used here to provide a custom name used in recording this function call.
  const result5 = callDurationMeasurer.invokeWithOptions(messageBuilder.buildMessage, {
    functionCallName: 'buildTopTierMessage',
    scope: messageBuilder,
    args: ['top', 'tier'],
  });
  console.log(result5);
  // 'Makoto is top tier'

  // Retrieve recorded call durations.
  const callDurations = callDurationMeasurer.getCallDurations();

  console.log(callDurations);
  /*
    [
      { name: 'someFunctionThatReturnsAPromise', duration: 1002 },
      { name: 'buildMessage', duration: 2 },
      { name: 'greet', duration: 1 },
      { name: 'greet', duration: 1 },
      { name: 'buildTopTierMessage', duration: 2 },
    ]
   */

  // Remove all recorded call durations.
  callDurationMeasurer.clearCallDurations();

  const updatedCallDurations = callDurationMeasurer.getCallDurations();

  console.log(updatedCallDurations);
  // []

  const result6 = callDurationMeasurer.measurify(greet)('Futaba');
  console.log(result6);
  // 'Hi, Futaba'

  // An array containing only the call duration for the most recent call to `greet` above is returned due to executing `clearCallDurations()` beforehand.
  const updatedCallDurations2 = callDurationMeasurer.getCallDurations();

  console.log(updatedCallDurations2);
  /*
    [
      { name: 'greet', duration: 1 },
    ]
   */
};

main();
```

### Stateless call duration measuring:
```
import { invoke, measurify, invokeWithOptions } from 'call-duration-measurer';

const someFunctionThatReturnsAPromise = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Resolved value!');
    }, 1000)
  });
};

const greet = name => {
  return `Hi, ${name}`;
};

class MessageBuilder {
  constructor(baseMessage) {
    this.baseMessage = baseMessage;
  }

  buildMessage(subMessage1, subMessage2) {
    return `${this.baseMessage} ${subMessage1} ${subMessage2}`;
  }
}

const main = async () => {
  // Invoke `someFunctionThatReturnsAPromise` and measure the time taken for this call INCLUDING the time taken for the promise to complete.
  const measurementResult1 = await invoke(someFunctionThatReturnsAPromise);
  console.log(measurementResult1);
  // { data: 'Resolved value!', duration: 1002 }

  const messageBuilder = new MessageBuilder('Makoto is');

  // Invoke the `buildMessage` method on `messageBuilder` with 'best' and 'girl' as arguments, and measure the time taken for this call to complete.
  const measurementResult2 = invoke(messageBuilder.buildMessage, messageBuilder, 'best', 'girl');
  console.log(measurementResult2);
  // { data: 'Makoto is best girl', duration: 2 }

  // Invoke the `buildMessage` method on `messageBuilder` with 'top' and 'tier' as arguments, and measure the time taken for this call to complete. The `invokeWithOptions` function is used here as an alternative to the `invoke` function.
  const measurementResult3 = invokeWithOptions(messageBuilder.buildMessage, {
    scope: messageBuilder,
    args: ['top', 'tier'],
  });
  console.log(measurementResult3);
  // { data: 'Makoto is top tier', duration: 2 }

  // Invoke `greet`, passing in 'Haru' as an argument, and measure the time taken for this call to complete. The value of `this` is irrelevant for this function, so `null` is passed in as the `scope` argument.
  const measurementResult4 = invoke(greet, null, 'Haru');
  console.log(measurementResult4);
  // { data: 'Hi, Haru', duration: 1 }

  // Invoke `greet`, passing in 'Sumire' as an argument, and measure the time taken for this call to complete. The `measurify` function (and the function returned by it) is used here as an alternative to the `invoke` function.
  const measurementResult5 = measurify(greet)('Sumire');
  console.log(measurementResult5);
  // { data: 'Hi, Sumire', duration: 1 }
};

main();
```

## Migrating from v1 to v2
If you are upgrading `call-duration-measurer` from v1 to v2, the only breaking change is to update your import statements for importing the `CallDurationMeasurer` class:

### call-duration-measurer v1

#### ES6
```
import CallDurationMeasurer from 'call-duration-measurer;
```

#### CommonJS
```
const CallDurationMeasurer = require('call-duration-measurer);
```

### call-duration-measurer v2

#### ES6
```
import { CallDurationMeasurer } from 'call-duration-measurer;
```

#### CommonJS
```
const { CallDurationMeasurer } = require('call-duration-measurer);
```

Please see the API documentation above for more details on importing the `CallDurationMeasurer` class.
