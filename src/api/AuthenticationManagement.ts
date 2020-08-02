import Common from "./Common";

export default class AuthenticationManagement extends Common {
    constructor() {
        super("/authentication-management");
    }

    static async getVersion(): Promise<String> {
        return super.getVersion("/authentication-management");
    }
}
