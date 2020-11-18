//import ReportBug from "@/components/common/ReportBug.vue";
//import { markRaw } from "vue";
import { useToast } from "@/toast";

const toast = useToast();

export function showNetworkErrorToast() {
    toast.error("Network error: make sure to establish a stable internet connection.");
}

export function showAPIToast(code: number, msg?: string) {
    switch (code) {
        case 400:
        case 500:
            //toast.error(markRaw(ReportBug));
            toast.error("Something went wrong on our side. Please consider reporting this bug.");
            break;
        case 404:
            toast.error("Could not find " + msg + ".");
            break;
        default:
            toast.error("Something went wrong. Please try again later.");
            break;
    }
}

export function showNotYetImplementedToast() {
    toast.warning("Not yet implemented.");
}
