import {
    Task
} from "../types";

function process(task: Task, times: number, reasons: any[], resolve, reject) {
    task().then((result) => {
        resolve(result);
    }).catch((reason) => {
        reasons.push(reason);
        if (reasons.length >= times) {
            reject(reasons);
        } else {
            process(task, times, resolve, reject, reasons);
        }
    });
}

export function retry(task: Task, times: number): Promise<any> {
    return new Promise(function (resolve, reject) {
        const reasons = [];
        process(task, times, reasons, resolve, reject);
    });
}
