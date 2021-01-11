//import ReportBug from "@/components/common/ReportBug.vue";
//import { markRaw } from "vue";
import { useToast } from "@/toast";
import Router from "@/use/router";

const toast = useToast();

function routeToDashboard() {
    Router.push({ name: "welcome" });
}

export function showOperationCreatedToast(operationType: String) {
    toast.info(
        `Successfully created ${operationType} request. You can check its current state in your dashboard. Click here to go there immediately.`,
        { onClick: routeToDashboard }
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
