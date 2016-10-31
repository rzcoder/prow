import {
    Tasks
} from "../types";


export function parallel(tasks: Tasks, maxThreads?: number): Promise<any> {
    if (!maxThreads) {
        maxThreads = tasks.length;
    }

    return new Promise(function (resolve, reject) {

        
    });
}
