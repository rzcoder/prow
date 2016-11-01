"use strict";
function waterfall(tasks) {
    if (tasks.length === 0) {
        return Promise.resolve();
    }
    var promise = tasks[0]();
    if (tasks.length > 1) {
        for (var _i = 0, tasks_1 = tasks; _i < tasks_1.length; _i++) {
            var task = tasks_1[_i];
            promise = promise.then(task);
        }
    }
    return promise;
}
exports.waterfall = waterfall;
