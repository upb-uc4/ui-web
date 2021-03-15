import Proposal from "@/api/api_models/common/Proposal";
import TransactionMessage, { Transaction } from "@/api/api_models/common/Transaction";
import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import CertificateManagement from "@/api/CertificateManagement";
import MatriculationManagement from "@/api/MatriculationManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";
import { AddEntriesToMatriculationTransaction } from "./AddEntries";
import { AddMatriculationDataTransaction } from "./AddMatriculation";
import { UpdateMatriculationDataTranscation } from "./UpdateMatriculation";

/**
 * All three matriculation transactions are hidden behind one endpoint.
 * As we do not know which transaction we actually get, we need this wrapper.
 */
export class GeneralMatriculationTransactionWrapper extends AbstractTransaction {
    private usernameToEnroll: string;
    private matriculation: SubjectMatriculation[];

    constructor(usernameToEnroll: string, matriculation: SubjectMatriculation[]) {
        super();
        this.usernameToEnroll = usernameToEnroll;
        this.matriculation = matriculation;
    }

    public async validateProposal(proposal: Proposal): Promise<boolean> {
        const enrollmentId = (await new CertificateManagement().getEnrollmentId([this.usernameToEnroll])).returnValue[0].enrollmentId;

        const valid = await Promise.all([
            new AddEntriesToMatriculationTransaction(this.usernameToEnroll, this.matriculation, enrollmentId).validateProposal(proposal),
            new AddMatriculationDataTransaction(this.usernameToEnroll, {
                enrollmentId,
                matriculationStatus: this.matriculation,
            }).validateProposal(proposal),
            new UpdateMatriculationDataTranscation(this.usernameToEnroll, {
                enrollmentId,
                matriculationStatus: this.matriculation,
            }).validateProposal(proposal),
        ]);

        return valid.includes(true);
    }

    public async validateTransaction(transcation: TransactionMessage): Promise<boolean> {
        const enrollmentId = (await new CertificateManagement().getEnrollmentId([this.usernameToEnroll])).returnValue[0].enrollmentId;

        const valid = await Promise.all([
            new AddEntriesToMatriculationTransaction(this.usernameToEnroll, this.matriculation, enrollmentId).validateTransaction(
                transcation
            ),
            new AddMatriculationDataTransaction(this.usernameToEnroll, {
                enrollmentId,
                matriculationStatus: this.matriculation,
            }).validateTransaction(transcation),
            new UpdateMatriculationDataTranscation(this.usernameToEnroll, {
                enrollmentId,
                matriculationStatus: this.matriculation,
            }).validateTransaction(transcation),
        ]);
        return valid.includes(true);
    }

    public buildTransactionInfo(): TransactionInfo {
        return {} as TransactionInfo;
    }

    public async getProposal(): Promise<UnsignedProposalMessage> {
        return new GenericResponseHandler("matriculation").handleResponse(
            await new MatriculationManagement().getUnsignedMatriculationProposal(this.usernameToEnroll, this.matriculation)
        );
    }
}
