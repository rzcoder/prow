var assert = require("chai").assert;
var prow = require("../dist/prow");

describe("Prow", function () {
    it("should create defer object", function () {
        assert.isFunction(prow.defer, 'Prow should have defer method');

        var deferred = prow.defer();

        assert.isFunction(deferred.resolve, 'deferred should have resolve method');
        assert.isFunction(deferred.reject, 'deferred should have reject method');
        assert.equal(deferred.promise.constructor.name, 'Promise', 'deferred should have promise object');
        assert.isFunction(deferred.promise.then, 'deferred should have promise object');
    });
});