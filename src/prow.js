(function () {
    var prow = {};

    /**
     * Return Promise for any data
     * @param result {Promise|*}
     * @returns {Promise}
     */
    prow.when = function (result) {
        if (result instanceof Promise && typeof result.then === "function") {
            return result;
        } else {
            var deferred = prow.defer();
            deferred.resolve(result);
            return deferred.promise;
        }
    };

    /**
     * Create deferred object
     * @param timeout {int} Timeout in ms. If specified deferred will call resolve after defined time
     * @param timelimit {int} Timeout in ms. If specified deferred will call reject after defined time
     * @returns {Defer} Defer object
     */
    prow.defer = function (timeout, timelimit) {
        var defer = {};
        var timeoutResolve, timeoutReject;

        defer.promise = new Promise(function (resolve, reject) {
            if (timeout) {
                timeoutResolve = setTimeout(resolve, timeout);
            }
            if (timelimit) {
                timeoutReject = setTimeout(reject, timelimit);
            }

            defer.resolve = function () {
                clearTimeout(timeoutResolve);
                resolve.apply(this, arguments);
            };

            defer.reject = function () {
                clearTimeout(timeoutReject);
                reject.apply(this, arguments);
            };
        });


        return defer;
    };

    /**
     * Promise which auto resolve after timeout
     * @param timeout {int} Timeout in ms
     * @param result {*} Result to provide in promise resolve
     * @returns {Promise} Promise object
     */
    prow.delay = function (timeout, result) {
        var promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(result);
            }, timeout);
        });

        return promise;
    };

    /**
     * Promise which auto reject after timelimit
     * @param timelimit {int} Timeout in ms
     * @param reason {*} Result to provide in promise reject
     * @returns {Promise} Promise object
     */
    prow.limit = function (timelimit, reason) {
        var promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
            }, timelimit);
        });

        return promise;
    };

    /**
     * Runs the tasks array of functions in series, each passing their results to the next in the array.
     * @param tasks {Array} Array of functions which returns promises
     * @returns {Promise} Promise object
     */
    prow.waterfall = function (tasks) {
        var length = tasks.length;
        var deferred = prow.defer();

        try {
            var process = function (cursor, result) {
                if (cursor >= length) {
                    deferred.resolve(result);
                } else {
                    var task = tasks[cursor];

                    prow.when(task.call(null, result)).then(function (result) {
                        process(++cursor, result);
                    }, function (reason) {
                        deferred.reject(reason);
                    }).catch(function (err) {
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

    /**
     * Run the tasks in parallel, without waiting until the previous function has completed. No results passed from promise to promise.
     * @param tasks {Array} Array of functions which returns promises
     * @param maxThreads {int} The maximum number of tasks to run at any time. Default: tasks.length
     * @returns {Promise} Promise which will resolve after all tasks done (resolved o rejected).
     */
    prow.parallel = function (tasks, maxThreads) {
        var length = tasks.length;
        var deferred = prow.defer();
        maxThreads = Math.min(maxThreads || length, length);

        var inProgress = 0;
        var cursor = 0;

        var process = function () {
            if (cursor >= length) {
                if (inProgress == 0) {
                    deferred.resolve();
                }
                return;
            }

            var task = tasks[cursor++];
            inProgress++;
            prow.when(task.call()).then(function () {
                inProgress--;
                process();
            }, function () {
                inProgress--;
                process();
            }).catch(function () {
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

    /**
     * Run the tasks one by one. No results passed from promise to promise.
     * @param tasks {Array} Array of functions which returns promises
     * @returns {Promise} Promise which will resolve after all tasks done (resolved o rejected).
     */
    prow.queue = function (tasks) {
        return prow.parallel.call(this, tasks, 1);
    };

    /**
     * Module loaders
     */
    if (typeof module == 'object' && module.exports) {
        module.exports = prow;
    } else if (typeof define == 'function' && define.amd) {
        define(function () {
            return prow;
        });
    } else if (typeof window == 'object') {
        window.prow = prow;
    }
})();