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

function promiseReject(rejectedTimes, resolveValue) {
    let counter = 0;
    return function () {
        if (counter++ < rejectedTimes) {
            return Promise.reject(counter);
        }
        return Promise.resolve(resolveValue);
    }
}

function delayedReject(delayTime, rejectValue) {
    return function() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(rejectValue);
            }, delayTime);
        });
    }
}

describe("Retry", function () {
    it("resolve", function () {
        return assert.becomes(prow.retry(resolvePromise("resolve"), 1), "resolve");
    });

    it("reject 5 times", function () {
        return prow.retry(promiseReject(5, null), 5).catch((data) => {
            assert.deepEqual(data, [1, 2, 3, 4, 5])
        });
    });

    it("reject 5 times, resolve on 6th", function () {
        return assert.becomes(prow.retry(promiseReject(5, 42), 6), 42);
    });

    it("reject by timeout", function () {
        return assert.isRejected(prow.retry(delayedReject(50, null), 5, 0, 200), prow.TimeoutError);
    });

    it("timeout, not rejected", function () {
        return prow.retry(delayedReject(50, null), 5, 0, 300).catch((data) => {
            assert.deepEqual(data, [null, null, null, null, null])
        });
    });
});