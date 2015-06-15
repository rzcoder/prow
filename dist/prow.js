(function() {
    var prow = {};
    prow.when = function(deferreds) {
        var deferred;
        if (deferreds instanceof Promise && typeof deferreds.then === "function") {
            if (deferreds instanceof Promise) {
                return deferreds;
            } else {
                deferred = prow.defer();
                deferreds.then(function() {
                    deferred.resolve.apply(this, arguments);
                }, function() {
                    deferred.reject.apply(this, arguments);
                });
                return deferred.promise;
            }
        } else {
            deferred = prow.defer();
            deferred.resolve(deferreds);
            return deferred.promise;
        }
    };
    prow.nextTick = function(task) {
        if (process && process.nextTick) {
            process.nextTick(task);
        } else {
            setTimeout(task, 0);
        }
    };
    prow.defer = function(timeout, timelimit) {
        var defer = {};
        var timeoutResolve, timeoutReject;
        defer.promise = new Promise(function(resolve, reject) {
            if (timeout) {
                timeoutResolve = setTimeout(resolve, timeout);
            }
            if (timelimit) {
                timeoutReject = setTimeout(reject, timelimit);
            }
            defer.resolve = function() {
                clearTimeout(timeoutResolve);
                resolve.apply(this, arguments);
            };
            defer.reject = function() {
                clearTimeout(timeoutReject);
                reject.apply(this, arguments);
            };
        });
        return defer;
    };
    prow.delay = function(timeout, result) {
        var promise = new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(result);
            }, timeout);
        });
        return promise;
    };
    prow.limit = function(timelimit, reason) {
        var promise = new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(reason);
            }, timelimit);
        });
        return promise;
    };
    prow.waterfall = function(tasks) {
        var length = tasks.length;
        var deferred = prow.defer();
        try {
            var process = function(cursor, result) {
                if (cursor >= length) {
                    deferred.resolve(result);
                } else {
                    var task = tasks[cursor];
                    prow.when(task.call(null, result)).then(function(result) {
                        process(++cursor, result);
                    }, function(reason) {
                        deferred.reject(reason);
                    }).catch(function(err) {
                        deferred.reject(err);
                    });
                }
            };
            process(0);
        } catch (err) {
            deferred.reject(err);
        }
        return deferred.promise;
    };
    prow.parallel = function(tasks, maxThreads) {
        var length = tasks.length;
        var deferred = prow.defer();
        maxThreads = Math.min(maxThreads || length, length);
        var inProgress = 0;
        var cursor = 0;
        var process = function() {
            if (cursor >= length) {
                if (inProgress === 0) {
                    deferred.resolve();
                }
                return;
            }
            var task = tasks[cursor++];
            inProgress++;
            prow.when(task.call()).then(function() {
                inProgress--;
                process();
            }, function() {
                inProgress--;
                process();
            }).catch(function() {
                inProgress--;
                process();
            });
            if (inProgress < maxThreads) {
                process();
            }
        };
        process();
        return deferred.promise;
    };
    prow.queue = function(tasks) {
        return prow.parallel.call(this, tasks, 1);
    };
    prow.retry = function(task, times) {
        times = times === undefined ? 1 : times;
        var deferred = prow.defer();
        var rejHandler = function(reason) {
            if (times === 0) {
                deferred.reject(reason);
            } else {
                process(--times);
            }
        };
        var process = function(times) {
            prow.when(task.call()).then(function(result) {
                deferred.resolve(result);
            }, rejHandler).catch(rejHandler);
        };
        process(--times);
        return deferred.promise;
    };
    prow.times = function(task, times) {
        times = times === undefined ? 1 : times;
        var results = [];
        var deferred = prow.defer();
        for (var i = 0; i < times; i++) {
            results.push(prow.when(task.call()));
        }
        Promise.all(results).then(deferred.resolve.bind(deferred, results), deferred.resolve.bind(deferred, results));
        return deferred.promise;
    };
    if (typeof module == "object" && module.exports) {
        module.exports = prow;
    } else if (typeof define == "function" && define.amd) {
        define(function() {
            return prow;
        });
    } else if (typeof window == "object") {
        window.prow = prow;
    }
})();