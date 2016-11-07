"use strict";
var prow = require("../prow");
function process(task, times, reasons, delay, resolve, reject) {
    return task().then(function (result) {
        resolve(result);
    }).catch(function (reason) {
        reasons.push(reason);
        if (reasons.length >= times && times >= 0) {
            reject(reasons);
        }
        else {
            if (delay > 0) {
                prow.delay(delay).then(function () { return process(task, times, reasons, delay, resolve, reject); });
            }
            else {
                process(task, times, reasons, delay, resolve, reject);
            }
        }
    });
}
function retry(task, times, delay) {
    if (times === void 0) { times = -1; }
    if (delay === void 0) { delay = 0; }
    return new Promise(function (resolve, reject) {
        var reasons = [];
        process(task, times, reasons, delay, resolve, reject);
    });
}
exports.retry = retry;
