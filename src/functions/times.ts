import {
    ITask
} from "../types";

function stopCheck(times: number, results: any[], resolve): boolean {
    if (results.length >= times) {
        resolve(results);
        return true;
    }
}

function process(task: ITask, times: number, results: any[], resolve, reject, stopOnFirstReject: boolean) {
    task().then((result) => {
        results.push(result);
        if (!stopCheck(times, results, resolve)) {
            process(task, times, results, resolve, reject, stopOnFirstReject);
        }
    }).catch((reason) => {
        results.push(reason);
        if (stopOnFirstReject) {
            reject(results);
        } else if (!stopCheck(times, results, resolve)) {
            process(task, times, results, resolve, reject, stopOnFirstReject);
        }
    });
}

export function times(task: ITask, times: number, stopOnFirstReject?: boolean): Promise<any> {
    if (times <= 0) {
        return Promise.resolve([]);
    }

    return new Promise(function (resolve, reject) {
        const results = [];
        process(task, times, results, resolve, reject, stopOnFirstReject);
    });
}