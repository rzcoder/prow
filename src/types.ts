export interface Task {
    (...args: any[]): Promise<any>
}
export type Tasks = Task[];

export class TimeoutError extends Error{
}
