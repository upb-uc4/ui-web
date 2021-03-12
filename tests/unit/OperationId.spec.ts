import Operation from "@/api/api_models/operation_management/Operation";
import { validateOperationId } from "@/api/helpers/OperationValidator";

test("Operation Id Validation", async () => {
    const op: Operation = {
        operationId: "5aggxV9rJela3N1wblsxFdMzlzwCT5lyGUv6zRUAcfY",
        transactionInfo: {
            contractName: "UC4.MatriculationData",
            transactionName: "addMatriculationData",
            parameters:
                '["{\\"enrollmentId\\":\\"bd4a174dff0d749fe73934e222fdeae7c9c67fb3294ff5d69c79a647e6207962\\",\\"matriculationStatus\\":[{\\"fieldOfStudy\\":\\"Bachelor Computer Science v3\\",\\"semesters\\":[\\"SS2020\\"]}]}"]',
        },
        state: "PENDING",
        reason: "",
        initiator: "bd4a174dff0d749fe73934e222fdeae7c9c67fb3294ff5d69c79a647e6207962",
        initiatedTimestamp: "2021-01-31T17:03:27",
        lastModifiedTimestamp: "2021-01-31T17:03:27",
        existingApprovals: { users: [], groups: [] },
        missingApprovals: { users: [], groups: [] },
    };

    expect(await validateOperationId(op)).toBe(true);

    op.operationId = "Some other string";

    expect(await validateOperationId(op)).toBe(false);
});
