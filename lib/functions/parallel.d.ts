import { Tasks } from "../types";
export declare function parallel(tasks: Tasks, maxThreads?: number): Promise<any>;
export declare function queue(tasks: Tasks): Promise<any>;
