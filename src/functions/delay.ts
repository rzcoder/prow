/**
 * Delayed resolving promise
 * @param time Time in ms before promise will resolved
 * @param value Value to be returned in Promise.resolve
 * @returns Promise
 */
export function delay(time: number, value?: any): Promise<any> {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, value), time);
    });
}