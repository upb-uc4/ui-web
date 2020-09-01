import Error from "@/api/api_models/errors/Error";

export default class ErrorBag {
    errors: Error[] = [];

    constructor(list?: Error[]) {
        if (list != undefined) {
            this.errors = list;
        }
    }

    has(key: string): boolean {
        return this.errors.some((e) => e.name === key);
    }

    hasNested(key: string): boolean {
        return this.errors.some((e) => e.name.endsWith(key));
    }

    get(key: string): string | undefined {
        const error = this.errors.find((e) => e.name === key);
        return error?.reason;
    }

    getNested(key: string): string | undefined {
        const error = this.errors.find((e) => e.name.endsWith(key));
        return error?.reason;
    }

    add(error: Error) {
        this.errors.push(error);
    }

    replaceAllWith(errors: Error[]) {
        this.clear();
        errors.forEach((e) => this.add(e));
    }

    count(): number {
        return this.errors.length;
    }

    clear() {
        this.errors = [];
    }

    isEmpty(): boolean {
        return this.count() === 0;
    }

    isNotEmpty(): boolean {
        return !this.isEmpty();
    }
}
