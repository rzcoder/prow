(function () {
    var prow = {};

    /**
     * Create deferred object
     * @param timeout Timeout in ms. If specified deferred will call resolve after defined time
     * @param timelimit Timeout in ms. If specified deferred will call reject after defined time
     * @returns {Defer} Defer object
     */
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
                resolve();
            };

            defer.reject = function() {
                clearTimeout(timeoutReject);
                reject();
            };
        });

        return defer;
    };

    /**
     * Promise resolved after timeout
     * @param timeout Timeout in ms
     * @returns {Promise} Promise object
     */
    prow.delay = function(timeout) {
        var promise = new Promise(function(resolve, reject) {
            setTimeout(resolve, timeout);
        });

        return promise;
    };

    if (typeof module == 'object' && module.exports) {
        module.exports = prow;
    } else if (typeof define == 'function' && define.amd) {
        define(function () {
            return prow;
        });
    } else if (typeof window == 'object') {
        window.Prow = prow;
    }
})();