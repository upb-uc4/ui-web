import AdmissionManagement from "@/api/AdmissionManagement";
import AbstractAdmission from "@/api/api_models/admission_management/AbstractAdmission";
import { AdmissionTypes } from "@/api/api_models/admission_management/AdmissionTypes";
import CourseAdmission from "@/api/api_models/admission_management/CourseAdmission";
import ExamAdmission from "@/api/api_models/admission_management/ExamAdmission";
import Proposal from "@/api/api_models/common/Proposal";
import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import Configuration from "@/api/api_models/configuration_management/Configuration";
import { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import ConfigurationManagement from "@/api/ConfigurationManagement";
import OperationManagement from "@/api/OperationManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";

export class AddAdmissionTransaction extends AbstractTransaction {
    private admission: AbstractAdmission;
    private enrollmentId: string;
    private operationId: string;

    constructor(enrollmentId: string, admission: AbstractAdmission) {
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

        const admission: AbstractAdmission = JSON.parse(JSON.parse(operation.returnValue.transactionInfo.parameters)[0]);

        const configuration: Configuration = (await new ConfigurationManagement().getConfiguration()).returnValue;

        if (!admission) return false;

        let isValid = false;
        switch (this.admission.type) {
            case AdmissionTypes.COURSE:
                isValid = this.validateCourseAdmission(admission as CourseAdmission);
                break;
            case AdmissionTypes.EXAM:
                isValid = this.validateExamAdmission(admission as ExamAdmission);
                break;
            default:
                break;
        }

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
        return new GenericResponseHandler("admission proposal").handleResponse(
            await new AdmissionManagement().getUnsignedAdmissionAddProposal(this.admission)
        );
    }

    public validateCourseAdmission(a: CourseAdmission) {
        let isValid = this.validateAdmission(a);
        if (!isValid) return false;

        const thisAdmission = this.admission as CourseAdmission;

        isValid = isValid && a.courseId == thisAdmission.courseId;
        isValid = isValid && a.moduleId == thisAdmission.moduleId;

        return isValid;
    }

    public validateExamAdmission(a: ExamAdmission) {
        let isValid = this.validateAdmission(a);
        if (!isValid) return false;

        const thisAdmission = this.admission as ExamAdmission;

        return a.examId == thisAdmission.examId;
    }

    public validateAdmission(a: AbstractAdmission) {
        let isValid = a.type == this.admission.type;
        isValid = isValid && a.enrollmentId == this.enrollmentId;
        return isValid;
    }
}
