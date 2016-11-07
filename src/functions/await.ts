import {
    ITask
} from "../types";

import * as prow from "../prow";

/**
 * Returns an Promise which will resolve when the condition is satisfied, or rejected if timeout expired
 * @param condition Task which should resolve with check result
 * @param delay Delay between when condition task return value and run new one
 * @param timeout Timeout before promise will rejected. `-1` for endless waiting.
 * @returns Promise
 */
export function await(condition: ITask, delay: number, timeout: number = -1): Promise<any> {
    const promise = new Promise(function (resolve) {
        const conditionHandler = (result) => {
            if (result) {
                resolve();
            }
        };
        prow.retry(condition, -1, delay).then(conditionHandler);
    });

    return prow.timeout(() => promise, timeout);
}