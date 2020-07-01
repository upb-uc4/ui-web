import ValidationError from "@/api/api_models/errors/ValidationError"

export default class ErrorHandler {
    errorList: {name: string, reason: string}[] = [];

    hasError(name: string): boolean {
        return this.errorList.filter(e => e.name == name).length > 0;
    }

    showError(name: string): string {
        const result = this.errorList.filter(e => e.name == name)[0]?.reason;
        return result ? result : ""
    }
}