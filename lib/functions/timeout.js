"use strict";
var types_1 = require("../types");
function timeout(time, task) {
    return new Promise(function (resolve, reject) {
        var timeout = setTimeout(reject.bind(null, new types_1.TimeoutError()), time);
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
