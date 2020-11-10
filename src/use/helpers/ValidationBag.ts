import { merge, get, has, cloneDeep } from "lodash";

export default class ValidationBag {
    validation = {} as any;
    flatValidation = {} as any;

    constructor(validation: any) {
        this.validation = cloneDeep(validation);

        this.validation.student = { ...this.validation.student, ...this.validation.user };
        this.validation.lecturer = { ...this.validation.lecturer, ...this.validation.user };
        this.validation.admin = { ...this.validation.admin, ...this.validation.user };

        this.validation.student.address = this.validation.address;
        this.validation.lecturer.address = this.validation.address;
        this.validation.admin.address = this.validation.address;

        this.flatValidation = this.flattenObject(this.validation);
    }

    has(key: string): boolean {
        return this.flatValidation[key] != undefined;
    }

    get(key: string): string {
        return this.flatValidation[key];
    }

    validate(object: any, prefix: string): boolean {
        let result = true;

        for (let key of Object.keys(object)) {
            if (typeof object[key] === "object" && object[key] !== null) {
                // element is an object
                result = result && this.validate(object[key], prefix + "." + key);
            } else {
                if (
                    typeof object[key] === "string" ||
                    typeof object[key] === "number" ||
                    object[key] instanceof String ||
                    object[key] instanceof Number
                ) {
                    if (this.has(prefix + "." + key)) {
                        const match = object[key].toString().match(this.get(prefix + "." + key));
                        result = result && match !== null && match[0] === object[key].toString();
                    }
                }
            }
        }
        return result;
    }

    flattenObject(ob: any) {
        var toReturn = {} as any;

        for (var i in ob) {
            Object.prototype.hasOwnProperty.call(ob, i);
            if (!Object.prototype.hasOwnProperty.call(ob, i)) continue;

            if (typeof ob[i] == "object" && ob[i] !== null) {
                var flatObject = this.flattenObject(ob[i]);
                for (var x in flatObject) {
                    if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue;

                    toReturn[i + "." + x] = flatObject[x];
                }
            } else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    }
}
