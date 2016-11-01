"use strict";
function stopCheck(times, results, resolve) {
    if (results.length >= times) {
        resolve(results);
        return true;
    }
}
function process(task, times, results, resolve, reject, stopOnFirstReject) {
    task().then(function (result) {
        results.push(result);
        if (!stopCheck(times, results, resolve)) {
            process(task, times, results, resolve, reject, stopOnFirstReject);
        }
    }).catch(function (reason) {
        results.push(reason);
        if (stopOnFirstReject) {
            reject(results);
        }
        else if (!stopCheck(times, results, resolve)) {
            process(task, times, results, resolve, reject, stopOnFirstReject);
        }
    });
}
function times(task, times, stopOnFirstReject) {
    if (times <= 0) {
        return Promise.resolve([]);
    }
    return new Promise(function (resolve, reject) {
        var results = [];
        process(task, times, results, resolve, reject, stopOnFirstReject);
    });
}
exports.times = times;
