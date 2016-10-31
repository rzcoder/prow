import {
    Tasks
} from "../types";

export function waterfall(tasks: Tasks): Promise<any> {
    if (tasks.length === 0) {
        return Promise.resolve();
    }

    let promise = tasks[0]();
    if (tasks.length > 1) {
        for (const task of tasks) {
            promise = promise.then(task);
        }
    }
    return promise;
}
