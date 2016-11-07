"use strict";
var types_1 = require("../types");
function timeout(task, time) {
    return new Promise(function (resolve, reject) {
        var timeout = -1;
        if (time >= 0) {
            timeout = setTimeout(reject.bind(null, new types_1.TimeoutError()), time);
        }
        task().then(function (result) {
            resolve(result);
            clearTimeout(timeout);
        }, function (reason) {
            reject(reason);
            clearTimeout(timeout);
        });
    });
}
exports.timeout = timeout;
