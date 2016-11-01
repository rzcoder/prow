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

function promiseRejected(rejectedTimes, resolveValue) {
    let counter = 0;
    return function () {
        if (counter++ < rejectedTimes) {
            return Promise.reject(counter);
        }
        return Promise.resolve(resolveValue);
    }
}

describe("Retry", function () {
    it("resolve", function () {
        return assert.becomes(prow.retry(resolvePromise("resolve"), 1), "resolve");
    });

    it("reject 5 times", function () {
        return prow.retry(promiseRejected(5, null), 5).catch((data) => {
            assert.deepEqual(data, [1, 2, 3, 4, 5])
        });
    });

    it("reject 5 times, resolve on 6th", function () {
        return assert.becomes(prow.retry(promiseRejected(5, 42), 6), 42);
    });
});