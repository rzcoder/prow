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

function promise3time(resolveValue, rejectValue) {
    let counter = 0;
    return function () {
        if (counter++ >= 3) {
            return Promise.reject(rejectValue);
        }
        return Promise.resolve(resolveValue);
    }
}

function promiseReturnCounter() {
    let counter = 0;
    return function () {
        return Promise.resolve(counter++);
    }
}

describe("Times", function () {
    it("0 times", function () {
        return assert.becomes(prow.times(resolvePromise(42), 0), []);
    });

    it("1 time", function () {
        return assert.becomes(prow.times(resolvePromise(42), 1), [42]);
    });

    it("10 times", function () {
        return assert.becomes(prow.times(promiseReturnCounter(), 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("5 times, rejected", function () {
        return assert.becomes(prow.times(rejectPromise(24), 5), [24, 24, 24, 24, 24]);
    });

    it("5 times, rejected on 4th and next, stopOnFirstReject off", function () {
        return assert.becomes(prow.times(promise3time(true, false), 5), [true, true, true, false, false]);
    });

    it("5 times, rejected on 4th and next, stopOnFirstReject on", function () {
        return assert.isRejected(prow.times(promise3time(true, false), 5, true), [true, true, true, false]);
    });
});
