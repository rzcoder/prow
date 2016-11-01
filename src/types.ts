export interface ITask {
    (...args: any[]): Promise<any>;
}

export type Tasks = ITask[];

export class TimeoutError extends Error {
}
