import AdmissionManagement from "@/api/AdmissionManagement";
import CourseAdmission from "@/api/api_models/admission_management/CourseAdmission";
import Proposal from "@/api/api_models/common/Proposal";
import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import OperationManagement from "@/api/OperationManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";

export class AddAdmissionTransaction extends AbstractTransaction {
    private admission: CourseAdmission;
    private enrollmentId: string;
    private operationId: string;

    constructor(enrollmentId: string, admission: CourseAdmission) {
        super();
        this.admission = admission;
        this.enrollmentId = enrollmentId;
        this.operationId = "This is an invalid operation Id";
    }

    public buildTransactionInfo(): TransactionInfo {
        return {} as TransactionInfo;
    }

    public async validateProposal(proposal: Proposal) {
        const proposalOperationId = proposal.payload.input.input.args[1];
        const operation = await new OperationManagement().getOperation(proposalOperationId);

        const admission: CourseAdmission = JSON.parse(JSON.parse(operation.returnValue.transactionInfo.parameters)[0]);

        if (!admission) return false;

        let isValid = admission.courseId == this.admission.courseId;
        isValid = isValid && admission.moduleId == this.admission.moduleId;
        isValid = isValid && admission.enrollmentId == this.enrollmentId;
        const dateDelta = new Date().getMilliseconds() - new Date(admission.timestamp).getMilliseconds();
        isValid = isValid && dateDelta > 0;
        isValid = isValid && dateDelta < 60000; // less than one minute ago

        if (isValid) {
            this.operationId = operation.returnValue.operationId;
        }

        isValid = isValid && (await super.validateProposal(proposal));

        return isValid;
    }

    public async calculateOperationId(_: TransactionInfo) {
        return this.operationId;
    }

    public async getProposal(): Promise<UnsignedProposalMessage> {
        return new GenericResponseHandler("matriculation").handleResponse(
            await new AdmissionManagement().getUnsignedCourseAdmissionAddProposal(this.admission)
        );
    }
}
