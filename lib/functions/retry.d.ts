import { ITask } from "../types";
export declare function retry(task: ITask, times?: number, delay?: number): Promise<any>;
