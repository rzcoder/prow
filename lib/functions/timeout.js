"use strict";
var types_1 = require("../types");
function timeout(task, timeout) {
    return new Promise(function (resolve, reject) {
        var timeoutId = -1;
        if (timeout >= 0) {
            timeoutId = setTimeout(reject.bind(null, new types_1.TimeoutError()), timeout);
        }
        task().then(function (result) {
            resolve(result);
            clearTimeout(timeoutId);
        }, function (reason) {
            reject(reason);
            clearTimeout(timeoutId);
        });
    });
}
exports.timeout = timeout;
