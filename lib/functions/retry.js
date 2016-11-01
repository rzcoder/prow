"use strict";
function process(task, times, reasons, resolve, reject) {
    task().then(function (result) {
        resolve(result);
    }).catch(function (reason) {
        reasons.push(reason);
        if (reasons.length >= times) {
            reject(reasons);
        }
        else {
            process(task, times, reasons, resolve, reject);
        }
    });
}
function retry(task, times) {
    return new Promise(function (resolve, reject) {
        var reasons = [];
        process(task, times, reasons, resolve, reject);
    });
}
exports.retry = retry;
