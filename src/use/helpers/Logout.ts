import AuthenticationManagement from "@/api/AuthenticationManagement";
import GenericResponseHandler from "./GenericResponseHandler";
import router from "../router";

export async function logout() {
    const auth = new AuthenticationManagement();

    const response = await auth.logout();
    const result = new GenericResponseHandler().handleResponse(response);

    if (result) {
        router.push("/");
    }
}
