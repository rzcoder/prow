# JS Promises Flow Control

## Install
```
    npm install prow
```

## API

### prow.defer()
Create deffered object with methods `resolve(result)`, `reject(reason)` and property `promise`.

```js
    var deferred = prow.defer();
    deferred.promise.then(function(result) { console.log('hello ' + result); });
    setTimeout(function() { deferred.resolve('world'); }, 1000);
```
