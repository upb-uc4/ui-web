//import ReportBug from "@/components/common/ReportBug.vue";
//import { markRaw } from "vue";
//import Router from "@/use/router";
import { useToast } from "@/toast";

const toast = useToast();

// function routeToDashboard() {
//     Router.push({ name: "welcome" });
// }

export function showOperationCreatedToast(operationType: String) {
    toast.info(
        `Successfully created ${operationType} request. You can check its current state in your dashboard on the welcome page.`
        //, { onClick: routeToDashboard }
    );
}

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
        case 403:
            toast.error("You are not authorized for " + msg + "!");
            break;
        case 404:
            toast.error("Could not find " + msg + ".");
            break;
        case 503:
            toast.error("Service unavailable. Please consider reporting this.");
            break;
        default:
            toast.error("Something went wrong. Please try again later.");
            break;
    }
}

export function showNotYetImplementedToast() {
    toast.warning("Not yet implemented.");
}
