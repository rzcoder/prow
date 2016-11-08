import {
    Tasks
} from "../types";

interface IScope {
    processes: number;
    pointer: number;
    tasks: Tasks;
    maxThreads: number;
    results: any[];
    resolve: any;
    reject: any;
}

function promiseHandler (index: number, data: any) {
    this.results[index] = data;
    this.processes--;
    if (this.processes === 0 && index === this.tasks.length - 1) {
        this.resolve(this.results);
    } else {
        process(this);
    }
}

function process(scope: IScope) {
    if (scope.processes < scope.maxThreads && scope.pointer < scope.tasks.length) {
        const handler = promiseHandler.bind(scope, scope.pointer);
        scope.tasks[scope.pointer]().then(handler, handler);
        scope.pointer++;
        scope.processes++;
    }
}

export function parallel(tasks: Tasks, maxThreads: number = tasks.length): Promise<any> {
    if (tasks.length === 0) {
        return Promise.resolve();
    }

    const scope: IScope = {
        processes: 0,
        pointer: 0,
        tasks: tasks,
        maxThreads: maxThreads,
        results: [],
        resolve: null,
        reject: null
    };

    return new Promise(function (resolve, reject) {
        for (let i = 0; i < maxThreads && i < tasks.length; i++) {
            scope.resolve = resolve;
            scope.reject = reject;
            process(scope);
        }
    });
}

export function queue(tasks: Tasks): Promise<any> {
    return parallel(tasks, 1);
}