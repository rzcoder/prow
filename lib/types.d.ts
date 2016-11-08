export interface ITask {
    (...args: any[]): Promise<any>;
}
export declare type Tasks = ITask[];
export declare class TimeoutError extends Error {
}
