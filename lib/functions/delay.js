"use strict";
/**
 * Delayed resolving promise
 * @param time Time in ms before promise will resolved
 * @param value Value to be returned in Promise.resolve
 * @returns Promise
 */
function delay(time, value) {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, value), time);
    });
}
exports.delay = delay;
