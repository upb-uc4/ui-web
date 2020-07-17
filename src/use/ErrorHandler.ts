import ValidationError from "@/api/api_models/errors/ValidationError";

export default function useErrorHandler() {
    var errorList: { name: string; reason: string }[] = [];

    function hasError(name: string): boolean {
        return errorList.filter((e) => e.name == name).length > 0;
    }

    function showError(name: string): string {
        const result = errorList.filter((e) => e.name == name)[0]?.reason;
        return result ? result : "";
    }

    return {
        errorList,
        hasError,
        showError,
    };
}
