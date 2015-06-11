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
                f.apply(this, arguments);
            };
            c.reject = function() {
                clearTimeout(e);
                g.apply(this, arguments);
            };
        });
        return c;
    };
    a.delay = function(a, b) {
        var c = new Promise(function(c, d) {
            setTimeout(function() {
                c(b);
            }, a);
        });
        return c;
    };
    a.limit = function(a, b) {
        var c = new Promise(function(c, d) {
            setTimeout(function() {
                d(b);
            }, a);
        });
        return c;
    };
    a.waterfall = function(b) {
        var c = b.length;
        var d = a.defer();
        var e = function(a, f) {
            if (a >= c) {
                d.resolve(f);
            } else {
                var g = b[a];
                g.call(this, f).then(function(b) {
                    e(++a, b);
                }, function(a) {
                    d.reject(a);
                });
            }
        };
        return d.promise;
    };
    if (typeof module == "object" && module.exports) {
        module.exports = a;
    } else if (typeof define == "function" && define.amd) {
        define(function() {
            return a;
        });
    } else if (typeof window == "object") {
        window.prow = a;
    }
})();