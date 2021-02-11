export default function numberZeroPad(param: number): string {
    if (param < 0) {
        Promise.reject("Input must be > 0 ");
    }
    return param < 10 ? `0${param}` : `${param}`;
}
