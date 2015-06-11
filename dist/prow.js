(function() {
    var a = {};
    a.when = function(b) {
        if (b instanceof Promise && typeof b.then === "function") {
            return b;
        } else {
            var c = a.defer();
            c.resolve(b);
            return c.promise;
        }
    };
    a.nextTick = function(a) {
        if (process && process.nextTick) {
            process.nextTick(a);
        } else {
            setTimeout(a, 0);
        }
    };
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
        try {
            var e = function(f, g) {
                if (f >= c) {
                    d.resolve(g);
                } else {
                    var h = b[f];
                    a.when(h.call(null, g)).then(function(a) {
                        e(++f, a);
                    }, function(a) {
                        d.reject(a);
                    }).catch(function(a) {
                        d.reject(a);
                    });
                }
            };
            e(0);
        } catch (f) {
            d.reject(f);
        }
        return d.promise;
    };
    a.parallel = function(b, c) {
        var d = b.length;
        var e = a.defer();
        c = Math.min(c || d, d);
        var f = 0;
        var g = 0;
        var h = function() {
            if (g >= d) {
                if (f === 0) {
                    e.resolve();
                }
                return;
            }
            var i = b[g++];
            f++;
            a.when(i.call()).then(function() {
                f--;
                h();
            }, function() {
                f--;
                h();
            }).catch(function() {
                f--;
                h();
            });
            if (f < c) {
                h();
            }
        };
        h();
        return e.promise;
    };
    a.queue = function(b) {
        return a.parallel.call(this, b, 1);
    };
    a.retry = function(b, c) {
        c = c === undefined ? 1 : c;
        var d = a.defer();
        var e = function(a) {
            if (c === 0) {
                d.reject(a);
            } else {
                f(--c);
            }
        };
        var f = function(a) {
            b.call().then(function(a) {
                d.resolve(a);
            }, e).catch(e);
        };
        f(--c);
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