"use strict";
function delay(time, value) {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, value), time);
    });
}
exports.delay = delay;
