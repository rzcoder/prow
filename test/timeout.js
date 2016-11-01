const _ = require("lodash");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const {assert, expect} = chai;
const prow = require("../lib/prow");

function resolvePromise(value) {
    return function (data) {
        if (data) {
            return Promise.resolve(data + 1);
        }
        return Promise.resolve(value);
    }
}

function rejectPromise(value) {
    return function () {
        return Promise.reject(value);
    }
}
describe("Timeout", function () {
    it("resolve value", function () {
        return assert.becomes(prow.timeout(100, resolvePromise(42)), 42);
    });

    it("reject promise value", function () {
        return assert.isRejected(prow.timeout(100, rejectPromise(24)), 24);
    });

    it("reject by timeout", function () {
        return assert.isRejected(prow.timeout(10, () => prow.delay(20, 300)), prow.TimeoutError);
    });
});
