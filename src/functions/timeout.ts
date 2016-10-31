import {
    Task, TimeoutError
} from "../types";

export function timeout(time: number, task: Task): Promise<any> {
    return new Promise(function (resolve, reject) {
        const timeout = setTimeout(reject.bind(null, new TimeoutError()), time);
        task().then((result) => {
            resolve(result);
            clearTimeout(timeout);
        }, (reason) => {
            reject(reason);
            clearTimeout(timeout);
        });
    });
}