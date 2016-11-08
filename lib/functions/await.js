"use strict";
var prow = require("../prow");
/**
 * Returns an Promise which will resolve when the condition is satisfied, or rejected if timeout expired
 * @param condition Task which should resolve with check result
 * @param delay Delay between when condition task return value and run new one
 * @param timeout Timeout before promise will rejected. `-1` for endless waiting.
 * @returns Promise
 */
function await(condition, delay, timeout) {
    if (timeout === void 0) { timeout = -1; }
    return new Promise(function (resolve, reject) {
        var conditionHandler = function (result) {
            if (result) {
                resolve();
            }
        };
        prow.retry(condition, -1, delay, timeout).then(conditionHandler).catch(reject);
    });
}
exports.await = await;
