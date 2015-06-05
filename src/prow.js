(function () {
    var prow = {};

    /* Defers */

    /**
     * Create deferred object
     * @returns {Defer} Defer object
     */
    prow.defer = function() {
        var defer = {};

        defer.promise = new Promise(function(resolve, reject) {
            defer.resolve = resolve;
            defer.reject = reject;
        });

        return defer;
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