import AuthenticationManagement from "@/api/AuthenticationManagement";
import { nextTick } from "vue";
import router from "../router";
import GenericResponseHandler from "./GenericResponseHandler";

export async function logout() {
    const auth = new AuthenticationManagement();

    const response = await auth.logout();
    const result = new GenericResponseHandler().handleResponse(response);

    if (result) {
        nextTick(() => {
            router.push({ name: "home" });
        });
    }
}
