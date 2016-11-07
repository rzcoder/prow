import {
    ITask
} from "../types";

import * as prow from "../prow";

function process(task: ITask, times: number, reasons: any[], delay, resolve, reject): Promise<any> {
    return task().then((result) => {
        resolve(result);
    }).catch((reason) => {
        reasons.push(reason);
        if (reasons.length >= times && times >= 0) {
            reject(reasons);
        } else {
            if (delay > 0) {
                prow.delay(delay).then(() => process(task, times, reasons, delay, resolve, reject));
            } else {
                process(task, times, reasons, delay, resolve, reject);
            }
        }
    });
}

export function retry(task: ITask, times: number = -1, delay: number = 0): Promise<any> {
    return new Promise(function (resolve, reject) {
        const reasons = [];
        process(task, times, reasons, delay, resolve, reject);
    });
}
