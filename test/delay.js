const _ = require("lodash");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const {assert, expect} = chai;
const prow = require("../lib/prow");

describe("Delay", function () {
    it("return value", function () {
        return assert.becomes(prow.delay(10, 300), 300);
    });

    it("delay 160ms", function () {
        const start = process.hrtime();
        return assert.becomes(prow.delay(160, 300), 300).then(() => {
            const time = process.hrtime(start);
            assert.approximately(time[0] * 100000000 + time[1], 160000000, 5000000)
        });
    });

    it("delay 1050ms", function () {
        const start = process.hrtime();
        return assert.becomes(prow.delay(1050, 300), 300).then(() => {
            const time = process.hrtime(start);
            assert.approximately(time[0] * 1000000000 + time[1], 1050000000, 5000000)
        });
    });
});
