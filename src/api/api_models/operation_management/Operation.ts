import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import { OperationStatus } from "./OperationState";

export default interface Operation {
    operationId: string;
    transactionInfo: {
        contractName: UC4Identifier;
        transactionName: UC4Identifier;
        parameters: string[];
    };
    initiator: string;
    initiatedTimestamp: string;
    lastModifiedTimestamp: string;
    state: OperationStatus;
    reason: string;
    existingApprovals: ApprovalList;
    missingApprovals: ApprovalList;
}

export interface ApprovalList {
    users: string[];
    groups: string[];
}
