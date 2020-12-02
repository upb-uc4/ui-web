import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import { decodeTransaction } from "@/api/helpers/TransactionDecoding";
import { matriculationTransactionValidator } from "@/api/helpers/TransactionValidator";

describe("Transaction Validation Tests", () => {
    const protoURL = "public/hlf-proto.json";

    test("Test Matriculation Transaction Validation", async () => {
        const transactionB64 = "";

        const transaction = await decodeTransaction(transactionB64, protoURL);

        if (!transaction) fail("Could not decode matriculation transaction");

        const enrollmentId = "";
        const matriculation: SubjectMatriculation[] = [];

        expect(matriculationTransactionValidator(enrollmentId, matriculation, transaction)).toBe(true);

        matriculation.push({ fieldOfStudy: "Some Studies", semesters: ["Some Semester"] });

        expect(matriculationTransactionValidator(enrollmentId, matriculation, transaction)).toBe(false);

        matriculation.splice(matriculation.length - 1, 1);

        expect(matriculationTransactionValidator(enrollmentId, matriculation, transaction)).toBe(true);

        transaction.data.actions.push(transaction.data.actions[0]);

        expect(matriculationTransactionValidator(enrollmentId, matriculation, transaction)).toBe(false);

        // TODO add invalid peer signature in the future, when we can actually verify it
    });
});
