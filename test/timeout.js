const _ = require("lodash");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const {assert} = chai;
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
        return assert.becomes(prow.timeout(resolvePromise(42), 100), 42);
    });

    it("reject promise value", function () {
        return assert.isRejected(prow.timeout(rejectPromise(24), 100), 24);
    });

    it("reject by timeout", function () {
        return assert.isRejected(prow.timeout(() => prow.delay(20, 300), 10), prow.TimeoutError);
    });
});
