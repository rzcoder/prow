(function () {
    var prow = {};

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

            throw 'lol'
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
        var process = function (cursor, result) {
            if (cursor >= length) {
                deferred.resolve(result);
            } else {
                var task = tasks[cursor];
                task.call(this, result).then(function (result) {
                    process(++cursor, result);
                }, function (reason) {
                    deferred.reject(reason);
                }).catch(function (err) {
                    console.log('wrong ' + err);
                    deferred.throw(err);
                });
            }
        };

        process(0);
        return deferred.promise;
    };

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