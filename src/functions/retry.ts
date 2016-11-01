import {
    ITask
} from "../types";

function process(task: ITask, times: number, reasons: any[], resolve, reject) {
    task().then((result) => {
        resolve(result);
    }).catch((reason) => {
        reasons.push(reason);
        if (reasons.length >= times) {
            reject(reasons);
        } else {
            process(task, times, reasons, resolve, reject);
        }
    });
}

export function retry(task: ITask, times: number): Promise<any> {
    return new Promise(function (resolve, reject) {
        const reasons = [];
        process(task, times, reasons, resolve, reject);
    });
}
