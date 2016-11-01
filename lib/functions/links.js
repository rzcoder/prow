"use strict";
function all(tasks) {
    return Promise.all(tasks);
}
exports.all = all;
function race(tasks) {
    return Promise.race(tasks);
}
exports.race = race;
