import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import { OperationStatus } from "./OperationState";

export default interface Operation {
    operationId: string;
    transactionInfo: {
        contractName: string;
        transactionName: string;
        parameters: string;
    };
    initiator: string;
    initiatedTimestamp: string;
    lastModifiedTimestamp: string;
    state: string;
    reason: string;
    existingApprovals: ApprovalList;
    missingApprovals: ApprovalList;
}

export interface ApprovalList {
    users: string[];
    groups: string[];
}
