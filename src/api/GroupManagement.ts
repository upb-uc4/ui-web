import CommonHyperledger from "./CommonHyperledger";

export default class GroupManagement extends CommonHyperledger {
    protected static endpoint = "/group-management";
    protected static serviceIdentifier = "group";

    constructor() {
        super(GroupManagement.endpoint, GroupManagement.serviceIdentifier);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }
}
