const _ = require("lodash");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const {assert, expect} = chai;
const prow = require("../lib/prow");

describe("Parallel", function () {
    it("queue", function () {
        const tasks = [];
        let counter = 0;
        for (let i = 0; i < 10; i++) {
            tasks.push(() => prow.delay(1).then(() => counter++));
        }

        return assert.becomes(prow.queue(tasks), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("parallel 1 thread", function () {
        const tasks = [];
        let counter = 0;
        for (let i = 0; i < 10; i++) {
            tasks.push(() => prow.delay(1).then(() => counter++));
        }

        return assert.becomes(prow.parallel(tasks, 1), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("parallel 2 threads", function () {
        const tasks = [];
        let counter = 0;
        for (let i = 0; i < 10; i++) {
            tasks.push(() => {
                counter++;
                return Promise.resolve().then(() => counter--)
            });
        }

        return assert.becomes(prow.parallel(tasks, 2), [2, 1, 2, 1, 2, 1, 2, 1, 2, 1]);
    });

    it("parallel 5 threads", function () {
        const tasks = [];
        let counter = 0;
        for (let i = 0; i < 10; i++) {
            tasks.push(() => {
                counter++;
                return Promise.resolve().then(() => counter--)
            });
        }

        return assert.becomes(prow.parallel(tasks, 5), [5, 4, 3, 2, 1, 5, 4, 3, 2, 1]);
    });

    it("parallel 7 threads", function () {
        const tasks = [];
        let counter = 0;
        for (let i = 0; i < 10; i++) {
            tasks.push(() => {
                counter++;
                return Promise.resolve().then(() => counter--)
            });
        }

        return assert.becomes(prow.parallel(tasks, 7), [7, 6, 5, 4, 3, 2, 1, 3, 2, 1]);
    });

    it("parallel 10 threads", function () {
        const tasks = [];
        let counter = 0;
        for (let i = 0; i < 10; i++) {
            tasks.push(() => {
                counter++;
                return Promise.resolve().then(() => counter--)
            });
        }

        return assert.becomes(prow.parallel(tasks), [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    });

    it("parallel 2 threads with rejects", function () {
        const tasks = [];
        let counter = 0;
        for (let i = 0; i < 10; i++) {
            tasks.push(() => {
                counter++;
                return Promise.reject().catch(() => counter--)
            });
        }

        return assert.becomes(prow.parallel(tasks, 2), [2, 1, 2, 1, 2, 1, 2, 1, 2, 1]);
    });
});
