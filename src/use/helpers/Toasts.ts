import { useToast } from "vue-toastification";

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
