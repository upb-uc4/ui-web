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
