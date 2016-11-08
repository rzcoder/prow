import {
    ITask, TimeoutError
} from "../types";

import * as prow from "../prow";

interface IScope {
    task: ITask;
    times: number;
    reasons: any[];
    delay: number;
    timeout: number;
    cancelled: boolean;
    timeoutId: number;
    resolve: any;
    reject: any;
}

function process(scope: IScope): Promise<any> {
    return scope.task().then((result) => {
        clearTimeout(scope.timeoutId);
        scope.resolve(result);
    }).catch((reason) => {
        scope.reasons.push(reason);
        if (scope.reasons.length >= scope.times && scope.times >= 0) {
            clearTimeout(scope.timeoutId);
            scope.reject(scope.reasons);
        } else if (!scope.cancelled) {
            if (scope.delay > 0) {
                prow.delay(scope.delay).then(() => process(scope));
            } else {
                process(scope);
            }
        }
    });
}

export function retry(task: ITask, times: number = -1, delay: number = 0, timeout: number = -1): Promise<any> {
    return new Promise(function (resolve, reject) {
        const reasons = [];
        const scope = {
            task,
            times,
            reasons,
            delay,
            timeout,
            cancelled: false,
            timeoutId: -1,
            resolve,
            reject
        };

        if (timeout >= 0) {
            scope.timeoutId = setTimeout(() => {
                scope.cancelled = true;
                reject(new TimeoutError());
            }, timeout);
        }

        process(scope);
    });
}
