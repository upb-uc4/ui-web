
export default class ErrorHandler {
    errors: { name: string; reason: string }[] = [];

    hasError(name: string): boolean {
        return this.errors.filter((e) => e.name == name).length > 0;
    }

    showError(name: string): string {
        const result = this.errors.filter((e) => e.name == name)[0]?.reason;
        return result ? result : "";
    }

    replaceErrors() {

    }
};
