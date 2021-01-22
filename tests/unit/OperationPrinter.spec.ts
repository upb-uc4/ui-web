import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import Operation from "@/api/api_models/operation_management/Operation";
import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import { printOperation } from "@/use/helpers/OperationPrinter";

describe("Operation Printer Tests", () => {
    test("Test add matriculation", () => {
        const matriculation: MatriculationData = {
            enrollmentId: "",
            matriculationStatus: [
                {
                    fieldOfStudy: "Bachelor of Science",
                    semesters: ["SS2020", "SS2021"],
                },
            ],
        };
        console.log(JSON.stringify([matriculation]));

        const operation: Operation = {
            existingApprovals: { groups: [], users: [] },
            initiatedTimestamp: "",
            initiator: "",
            lastModifiedTimestamp: "",
            missingApprovals: { groups: [], users: [] },
            operationId: "",
            reason: "",
            state: "",
            transactionInfo: {
                contractName: UC4Identifier.CONTRACT_MATRICULATION,
                parameters: JSON.stringify([JSON.stringify(matriculation)]),
                transactionName: UC4Identifier.TRANSACTION_ADD_MATRICULATION,
            },
        };

        const printed = printOperation(operation);

        expect(printed.length).toBe(1);
        expect(printed[0]).toEqual("Bachelor of Science SS2020, SS2021");
    });

    test("Test addentries matriculation", () => {
        const matriculation: MatriculationData = {
            enrollmentId: "",
            matriculationStatus: [
                {
                    fieldOfStudy: "Bachelor of Science",
                    semesters: ["SS2020", "SS2021"],
                },
            ],
        };

        const operation: Operation = {
            existingApprovals: { groups: [], users: [] },
            initiatedTimestamp: "",
            initiator: "",
            lastModifiedTimestamp: "",
            missingApprovals: { groups: [], users: [] },
            operationId: "",
            reason: "",
            state: "",
            transactionInfo: {
                contractName: UC4Identifier.CONTRACT_MATRICULATION,
                parameters: JSON.stringify(["", JSON.stringify(matriculation.matriculationStatus)]),
                transactionName: UC4Identifier.TRANSACTION_ADD_ENTRIES_MATRICULATION,
            },
        };

        const printed = printOperation(operation);

        expect(printed.length).toBe(1);
        expect(printed[0]).toEqual("Bachelor of Science SS2020, SS2021");
    });
});
