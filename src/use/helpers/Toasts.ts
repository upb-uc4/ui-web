const ReportBug = () => import("@/components/common/ReportBug.vue");
import { useToast } from "@/toast";
import { markRaw } from "vue";

const toast = useToast();

export function showNetworkErrorToast() {
    toast.error("Network error: make sure to establish a stable internet connection.");
}

export function showAPIToast(code: number, msg?: string) {
    switch (code) {
        case 400:
        case 500:
            toast.error(markRaw(ReportBug));
            break;
        case 404:
            toast.error("Could not find " + msg + ".");
            break;
        default:
            toast.error("Something went wrong. Please try again later.");
            break;
    }
}
