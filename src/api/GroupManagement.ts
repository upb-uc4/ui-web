import CommonHyperledger from "./CommonHyperledger";

export default class GroupManagement extends CommonHyperledger {
    protected static endpoint = "/group-management";

    constructor() {
        super(GroupManagement.endpoint);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }
}
