<template>
    <h1 class="text-2xl font-semibold text-gray-700">Dashboard</h1>
    <div v-if="busy" class="mx-auto">
        <loading-spinner />
    </div>
    <div v-else class="flex flex-col w-full items-center mt-10">
        <div class="w-full flex justify-between">
            <div class="w-1/2 rounded-lg border border-gray-500 mr-10 h-auto p-4 overflow-y-auto">
                <dashboard-component :username="username" :role="role" :operations="finishedOperations" title="Finished Operations" />
            </div>
            <div class="w-1/2 rounded-lg border border-gray-500 ml-10 h-auto p-4 overflow-y-auto">
                <dashboard-component :username="username" :role="role" :operations="actionNeededOperations" title="Action Required" />
            </div>
        </div>
        <div class="w-1/2 rounded-lg border border-gray-500 h-auto p-4 mt-10 mb-10 overflow-y-auto">
            <dashboard-component :username="username" :role="role" :operations="pendingOwnOperations" title="Pending Operations" />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, onBeforeMount, ref } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import Operation, { ApprovalList } from "@/api/api_models/operations_management/Operation";
    import { UC4Identifier } from "@/api/helpers/UC4Identifier";
    import { OperationStatus } from "@/api/api_models/operations_management/OperationState";
    import DashboardComponent from "@/components/common/dashboard/DashboardComponent.vue";
    import { useStore } from "@/use/store/store";

    export default {
        name: "Dashboard",
        components: {
            LoadingSpinner,
            DashboardComponent,
        },
        setup() {
            const busy = ref(false);
            const operations = ref([] as Operation[]);
            const store = useStore();
            const username = ref("");
            const role = ref("");

            let mockedOps = [
                {
                    operationId: "PendingMatriculation1",
                    initiator: "MockUser1",
                    transactionInfo: {
                        contractName: UC4Identifier.CONTRACT_MATRICULATION,
                        transactionName: UC4Identifier.TRANSACTION_ADD_MATRICULATION,
                        parameters: ["SS2020", "Computer Science v3"],
                    },
                    state: OperationStatus.PENDING,
                    reason: "",
                    existingApprovals: {
                        users: [],
                        groups: [],
                    } as ApprovalList,
                    missingApprovals: {
                        users: [],
                        groups: ["admin"],
                    } as ApprovalList,
                } as Operation,
                {
                    operationId: "PendingMatriculation2",
                    initiator: "MockUser2",
                    transactionInfo: {
                        contractName: UC4Identifier.CONTRACT_MATRICULATION,
                        transactionName: UC4Identifier.TRANSACTION_ADD_MATRICULATION,
                        parameters: ["SS2019", "Computer Science v4"],
                    },
                    state: OperationStatus.PENDING,
                    reason: "",
                    existingApprovals: {
                        users: [],
                        groups: ["lecturer"],
                    } as ApprovalList,
                    missingApprovals: {
                        users: [],
                        groups: ["admin"],
                    } as ApprovalList,
                } as Operation,
                {
                    operationId: "RejectedMatriculation1",
                    initiator: "MockUser3",
                    transactionInfo: {
                        contractName: UC4Identifier.CONTRACT_MATRICULATION,
                        transactionName: UC4Identifier.TRANSACTION_ADD_MATRICULATION,
                        parameters: ["SS2020", "Computer Science v3"],
                    },
                    state: OperationStatus.REJECTED,
                    reason: "Mocked Reason",
                    existingApprovals: {
                        users: [],
                        groups: [],
                    } as ApprovalList,
                    missingApprovals: {
                        users: [],
                        groups: ["admin"],
                    } as ApprovalList,
                } as Operation,
                {
                    operationId: "FinishedMatriculation1",
                    initiator: "MockUser4",
                    transactionInfo: {
                        contractName: UC4Identifier.CONTRACT_MATRICULATION,
                        transactionName: UC4Identifier.TRANSACTION_ADD_MATRICULATION,
                        parameters: ["SS2020", "Computer Science v3"],
                    },
                    state: OperationStatus.FINISHED,
                    reason: "",
                    existingApprovals: {
                        users: [],
                        groups: ["admin"],
                    } as ApprovalList,
                    missingApprovals: {
                        users: [],
                        groups: [],
                    } as ApprovalList,
                } as Operation,
            ];

            onBeforeMount(async () => {
                await getOperations();
                //username.value = (await store.getters.user).username;
                //role.value = (await store.getters.user).role;
            });

            const pendingOwnOperations = computed(() =>
                operations.value.filter((op) => op.state == OperationStatus.PENDING && op.initiator == username.value)
            );
            const finishedOperations = computed(() =>
                operations.value.filter((op) => op.state == OperationStatus.REJECTED || op.state == OperationStatus.FINISHED)
            );
            const actionNeededOperations = computed(() =>
                operations.value.filter(
                    (op) =>
                        op.state == OperationStatus.PENDING &&
                        (op.missingApprovals.users.includes(username.value) || op.missingApprovals.groups.includes(role.value))
                )
            );
            async function getOperations() {
                //TODO API
                operations.value = mockedOps;
                username.value = "MockUser5";
                role.value = "admin";
            }

            return {
                busy,
                operations,
                pendingOwnOperations,
                finishedOperations,
                actionNeededOperations,
                username,
                role,
            };
        },
    };
</script>
