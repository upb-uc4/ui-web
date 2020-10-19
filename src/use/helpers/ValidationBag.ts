export default class ValidationBag {
    validation = {} as any;

    constructor(validation: any) {
        this.validation = validation;
    }

    has(key: string): boolean {
        return this.validation[key] !== undefined;
    }

    hasNested(key: string): boolean {
        return this.keyify(this.validation).some((element) => element.includes(key));
    }

    get(key: string): string {
        return this.validation[key];
    }

    getNested(key: string): string {
        return this.keyify(this.validation).filter((element) => element.includes(key))[0];
    }

    validate(object: any): boolean {
        let result = true;
        for (let key in Object.keys(object)) {
            if (typeof object[key] === "object" && object[key] !== null) {
                // element is an object
                result = result && this.validate(object[key]);
            } else {
                if (typeof object[key] === "string" || object[key] instanceof String) {
                    if (this.hasNested(key)) {
                        result = result && new RegExp(this.getNested(key)).test(object[key]);
                    }
                }
            }
        }
        return result;
    }

    clear() {
        this.validation = {};
    }

    keyify(obj: any, prefix = ""): string[] {
        return Object.keys(obj).reduce((res: string[], el: any) => {
            if (Array.isArray(obj[el])) {
                return res;
            } else if (typeof obj[el] === "object" && obj[el] !== null) {
                return [...res, ...this.keyify(obj[el], prefix + el + ".")];
            }
            return [...res, prefix + el];
        }, []);
    }
}
