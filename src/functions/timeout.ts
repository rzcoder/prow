import {
    ITask, TimeoutError
} from "../types";

export function timeout(task: ITask, time: number): Promise<any> {
    return new Promise(function (resolve, reject) {
        let timeout = -1;
        if (time >= 0) {
            timeout = setTimeout(reject.bind(null, new TimeoutError()), time);
        }

        task().then((result) => {
            resolve(result);
            clearTimeout(timeout);
        }, (reason) => {
            reject(reason);
            clearTimeout(timeout);
        });
    });
}