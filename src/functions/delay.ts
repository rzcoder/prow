export function delay(time: number, value?: any): Promise<any> {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, value), time);
    });
}