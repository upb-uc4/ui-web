import Common from "./Common";

export default class HyperledgerManagement extends Common {
    constructor() {
        super("/hyperledger-management");
    }

    static async getVersion(): Promise<String> {
        return super.getVersion("/hyperledger-management");
    }
}
