import APIResponse from "@/api/helpers/models/APIResponse";
import { useStore } from "@/store/store";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import LoginModal from "@/components/modals/LoginModal.vue";

export default async function handleAuthenticationError<T>(response: APIResponse<T>) {
    if (response.statusCode == 401) {
        // read error message and do one of the following
        const error = response.error;

        if (error.type == "token missing" || error.type == "refresh token expired") {
            const store = useStore();
            const modal = store.state.modal;
            const success = ((await modal) as typeof LoginModal).show();
            return success;
        }

        if (error.type == "login token expired") {
            const response = await AuthenticationManagement.login();
            return response.returnValue;
        }
    }

    return true;
}
