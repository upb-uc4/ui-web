export default function compareArrays(one: any[], two: any[]): boolean {
    if (one.length != two.length) return false;
    for (let i = 0; i < one.length; i++) {
        if (!one.includes(two[i]) || !two.includes(one[i])) {
            return false;
        }
    }
    return true;
}
