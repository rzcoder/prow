"use strict";
var types_1 = require("../types");
var prow = require("../prow");
function process(scope) {
    return scope.task().then(function (result) {
        clearTimeout(scope.timeoutId);
        scope.resolve(result);
    }).catch(function (reason) {
        scope.reasons.push(reason);
        if (scope.reasons.length >= scope.times && scope.times >= 0) {
            clearTimeout(scope.timeoutId);
            scope.reject(scope.reasons);
        }
        else if (!scope.cancelled) {
            if (scope.delay > 0) {
                prow.delay(scope.delay).then(function () { return process(scope); });
            }
            else {
                process(scope);
            }
        }
    });
}
function retry(task, times, delay, timeout) {
    if (times === void 0) { times = -1; }
    if (delay === void 0) { delay = 0; }
    if (timeout === void 0) { timeout = -1; }
    return new Promise(function (resolve, reject) {
        var reasons = [];
        var scope = {
            task: task,
            times: times,
            reasons: reasons,
            delay: delay,
            timeout: timeout,
            cancelled: false,
            timeoutId: -1,
            resolve: resolve,
            reject: reject
        };
        if (timeout >= 0) {
            scope.timeoutId = setTimeout(function () {
                scope.cancelled = true;
                reject(new types_1.TimeoutError());
            }, timeout);
        }
        process(scope);
    });
}
exports.retry = retry;
