import { useToast } from "@/toast";

const toast = useToast();

export function showNetworkErrorToast() {
    toast.warning("Network error: make sure to establish a stable internet connection.");
}

export function showAPI400Toast() {
    toast.warning("HTTP Bad Request");
}

export function showAPI404Toast() {
    toast.warning("HTTP Not Found");
}

export function showUpdateSuccessToast(subject: string) {
    toast.success("'" + subject + "' updated.");
}

export function showUpdateFailedToast(subject: string) {
    toast.error("Error: '" + subject + "' not updated.");
}

export function showAPIToast(code: string, msg?: string) {
    switch (code) {
        case "400":
            toast.error("Something went wrong on our side. Please consider to report this bug");
            break;
        case "404":
            toast.error("Could not find " + msg + ".");
            break;
        default:
            toast.error("Something went wrong. Please try again later.");
            break;
    }
}
