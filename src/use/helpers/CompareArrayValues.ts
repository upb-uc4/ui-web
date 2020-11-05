export default function compareArrays(one: any[], two: any[]): boolean {
    console.log(one, two);
    if (one.length != two.length) return false;
    for (let i = 0; i < one.length - 1; i++) {
        if (!one.includes(two[i]) || !two.includes(one[i])) return false;
    }
    return true;
}
