export interface Task {
    (...args: any[]): Promise<any>
}
export type Tasks = Task[];