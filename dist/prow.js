(function() {
    var a = {};
    a.defer = function(a, b) {
        var c = {};
        var d, e;
        c.promise = new Promise(function(f, g) {
            if (a) {
                d = setTimeout(f, a);
            }
            if (b) {
                e = setTimeout(g, b);
            }
            c.resolve = function() {
                clearTimeout(d);
                f();
            };
            c.reject = function() {
                clearTimeout(e);
                g();
            };
        });
        return c;
    };
    a.delay = function(a) {
        var b = new Promise(function(b, c) {
            setTimeout(b, a);
        });
        return b;
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