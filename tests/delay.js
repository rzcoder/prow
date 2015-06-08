var assert = require("chai").assert;
var sinon = require('sinon');
var prow = require("../dist/prow");

describe("Prow Delay", function () {
    beforeEach(function() {
        this.sinon = sinon.sandbox.create();
    });

    it("should create delay promise", function () {
        assert.isFunction(prow.delay, 'Prow should have delay method');

        var promise = prow.delay(5);
    });

    afterEach(function(){
        this.sinon.restore();
    });
});