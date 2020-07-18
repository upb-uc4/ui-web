import Error from "@/api/api_models/errors/Error";

export default class ErrorHandler {
    errors: Error[] = [];

    hasError(name: string): boolean {
        return this.errors.filter((e) => e.name == name).length > 0;
    }

    showError(name: string): string {
        const result = this.errors.filter((e) => e.name == name)[0]?.reason;
        return result ? result : "";
    }

    replaceErrors(errors: Error[]) {
        this.errors = errors;
    }
}
