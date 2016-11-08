import { ITask } from "../types";
/**
 * Returns an Promise which will resolve when the condition is satisfied, or rejected if timeout expired
 * @param condition Task which should resolve with check result
 * @param delay Delay between when condition task return value and run new one
 * @param timeout Timeout before promise will rejected. `-1` for endless waiting.
 * @returns Promise
 */
export declare function await(condition: ITask, delay: number, timeout?: number): Promise<any>;
