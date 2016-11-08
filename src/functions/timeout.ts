import {
    ITask, TimeoutError
} from "../types";

export function timeout(task: ITask, timeout: number): Promise<any> {
    return new Promise(function (resolve, reject) {
        let timeoutId = -1;
        if (timeout >= 0) {
            timeoutId = setTimeout(reject.bind(null, new TimeoutError()), timeout);
        }

        task().then((result) => {
            resolve(result);
            clearTimeout(timeoutId);
        }, (reason) => {
            reject(reason);
            clearTimeout(timeoutId);
        });
    });
}