"use strict";
function promiseHandler(index, data) {
    this.results[index] = data;
    this.processes--;
    if (this.processes === 0 && index === this.tasks.length - 1) {
        this.resolve(this.results);
    }
    else {
        execute(this);
    }
}
function execute(scope) {
    if (scope.processes < scope.maxThreads && scope.pointer < scope.tasks.length) {
        var handler = promiseHandler.bind(scope, scope.pointer);
        scope.tasks[scope.pointer]().then(handler, handler);
        scope.pointer++;
        scope.processes++;
    }
}
function parallel(tasks, maxThreads) {
    if (maxThreads === void 0) { maxThreads = tasks.length; }
    if (tasks.length === 0) {
        return Promise.resolve();
    }
    var scope = {
        processes: 0,
        pointer: 0,
        tasks: tasks,
        maxThreads: maxThreads,
        results: [],
        resolve: null,
        reject: null
    };
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < maxThreads && i < tasks.length; i++) {
            scope.resolve = resolve;
            scope.reject = reject;
            execute(scope);
        }
    });
}
exports.parallel = parallel;
function queue(tasks) {
    return parallel(tasks, 1);
}
exports.queue = queue;
