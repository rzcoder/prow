# JS Promises Flow Control

## Install
```
    npm install prow
```

## API

### prow.defer(timeout, timelimit)
Create deferred object with methods `resolve(result)`, `reject(reason)` and property `promise`.

Promise will resolve automatically after timeout (if specified) or automatically rejected after timelimit (if specified).

```js
    var deferred = prow.defer();
    deferred.promise.then(function(result) { console.log('hello ' + result); });
    setTimeout(function() { deferred.resolve('world'); }, 1000);

    var deferred = prow.defer(null, 1000);
    deferred.promise.then(null, function() { console.log('timeout rejected'); });
```

### prow.waterfall(tasks)
Runs the tasks array of functions in series, each passing their results to the next in the array. Returns Promise object;

### prow.parallel(tasks, maxThreads)
Run the tasks in parallel, without waiting until the previous function has completed. No results passed from promise to promise. Returns Promise which will resolve after all tasks done (resolved o rejected).

### prow.queue(tasks)
Run the tasks one by one. No results passed from promise to promise. Returns Promise which will resolve after all tasks done (resolved o rejected).


## License

Copyright (c) 2015 rzcoder

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.