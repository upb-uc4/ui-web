import { useToast } from "@/toast";
import ReportBug from "@/components/common/ReportBug.vue";
import { markRaw } from "vue";

const toast = useToast();

export function showNetworkErrorToast() {
    toast.error("Network error: make sure to establish a stable internet connection.");
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
        case "500":
            toast.error(markRaw(ReportBug));
            break;
        case "404":
            toast.error("Could not find " + msg + ".");
            break;
        default:
            toast.error("Something went wrong. Please try again later.");
            break;
    }
}
