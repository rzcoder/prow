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

describe("Waterfall", function () {
    it("single resolved promise", function () {
        return assert.becomes(prow.waterfall([resolvePromise("resolved value")]), "resolved value");
    });

    it("single rejected promise", function () {
        return assert.isRejected(prow.waterfall([rejectPromise("rejected reason")]), "rejected reason");
    });

    it("few resolved promises", function () {
        return assert.becomes(prow.waterfall([resolvePromise(1), resolvePromise(), resolvePromise(), resolvePromise()]), 5);
    });

    it("few resolved promises with rejected one", function () {
        return assert.isRejected(
            prow.waterfall([resolvePromise(), resolvePromise(), rejectPromise("rejected reason"), resolvePromise()]),
            "rejected reason"
        );
    });

    it("data waterfall", function () {
        return assert.becomes(
            prow.waterfall([
                function () {
                    return Promise.resolve("first");
                },
                function (data) {
                    return Promise.resolve({
                        [data]: 42
                    });
                },
                function (data) {
                    data["first"] *= 10;
                    return Promise.resolve(data);
                },
                function (data) {
                    return Promise.resolve(data).then(_.toPairs);
                },
            ]),
            [["first", 420]]
        );
    });

    it("combine waterfalls", function () {
        const promise = prow.waterfall([
            function () {
                return Promise.resolve("first");
            },
            function (data) {
                return [
                    function () {
                        return Promise.resolve({
                            [data]: 42
                        });
                    },
                    function (data) {
                        return Promise.resolve(data.first + 10);
                    }
                ]
            }
        ]).then(prow.waterfall).then((data) => {
            return prow.waterfall([
                function () {
                    return Promise.resolve({
                        [data]: "second"
                    });
                },
                function (data) {
                    data["third"] = data[52] + "_";
                    return Promise.resolve(data);
                }
            ]);
        });

        return assert.becomes(promise, {
            "52": "second",
            "third": "second_"
        });
    });

});
