(function() {
    var a = {};
    a.defer = function() {
        var a = {};
        a.promise = new Promise(function(b, c) {
            a.resolve = b;
            a.reject = c;
        });
        return a;
    };
    if (typeof module == "object" && module.exports) {
        module.exports = a;
    } else if (typeof define == "function" && define.amd) {
        define(function() {
            return a;
        });
    } else if (typeof window == "object") {
        window.Prow = a;
    }
})();