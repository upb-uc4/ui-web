import Operation from "@/api/api_models/operation_management/Operation";

export default function filterOperations(ops: Operation[], filter: string): Operation[] {
    const trimmedFilter = filter.replace(/\s/g, "").toLowerCase();
    if (trimmedFilter != "") {
        const filteredOperations = ops.filter(
            (op) =>
                op.operationId.replace(/\s/g, "").toLowerCase().includes(trimmedFilter) ||
                op.initiator.replace(/\s/g, "").toLowerCase().includes(trimmedFilter) ||
                op.transactionInfo.parameters.toString().replace(/\s/g, "").toLowerCase().includes(trimmedFilter)
        );
        return filteredOperations;
    }
    return ops;
}
