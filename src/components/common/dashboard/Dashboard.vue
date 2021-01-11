<template>
    <h1 class="text-xl text-gray-700">In this dashboard, you find all your requested operations concerning your account.</h1>
    <div v-if="busy" class="mx-auto">
        <loading-spinner />
    </div>
    <div v-else class="flex flex-col w-full items-center mt-10">
        <div class="flex sm:flex-row flex-col-reverse w-full">
            <seach-bar v-model:message="message" @refresh="refresh" />
        </div>
        <div class="w-full my-5 lg:flex lg:justify-between">
            <dashboard-component
                class="lg:mr-5 lg:w-1/2"
                :enrollment-id="enrollmentId"
                :role="role"
                :operations="finishedOperations"
                title="Finished Operations"
                @marked-read="markRead"
            />
            <dashboard-component
                class="mt-5 lg:mt-0 lg:w-1/2"
                :enrollment-id="enrollmentId"
                :role="role"
                :operations="actionNeededOperations"
                title="Action Required"
            />
        </div>
        <dashboard-component :enrollment-id="enrollmentId" :role="role" :operations="pendingOwnOperations" title="Pending Operations" />
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
    import SeachBar from "@/components/common/SearchBar.vue";
    import { MutationTypes } from "@/use/store/mutation-types";

    export default {
        name: "Dashboard",
        components: {
            LoadingSpinner,
            DashboardComponent,
            SeachBar,
        },
        setup() {
            const busy = ref(false);
            const message = ref("");
            const operations = ref([] as Operation[]);
            const store = useStore();
            const role = ref("");
            const enrollmentId = ref("");

            let mockedOps = [
                {
                    operationId: "PendingMatriculation1",
                    initiator: "MockUser1",
                    initiatedTimestamp: "2011-10-05T14:48:00.000Z",
                    lastModifiedTimestamp: "2020-10-05T16:48:00.000Z",
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
                        groups: ["Admin"],
                    } as ApprovalList,
                } as Operation,
                {
                    operationId: "PendingMatriculation2",
                    initiator: "MockUser2",
                    initiatedTimestamp: "2011-10-05T14:48:00.000Z",
                    lastModifiedTimestamp: "2020-10-05T16:48:00.000Z",
                    transactionInfo: {
                        contractName: UC4Identifier.CONTRACT_MATRICULATION,
                        transactionName: UC4Identifier.TRANSACTION_ADD_MATRICULATION,
                        parameters: ["SS2019", "Computer Science v4"],
                    },
                    state: OperationStatus.PENDING,
                    reason: "",
                    existingApprovals: {
                        users: [],
                        groups: ["Lecturer"],
                    } as ApprovalList,
                    missingApprovals: {
                        users: [],
                        groups: ["Admin"],
                    } as ApprovalList,
                } as Operation,
                {
                    operationId: "RejectedMatriculation1",
                    initiator: "MockUser5",
                    initiatedTimestamp: "2011-10-05T14:48:00.000Z",
                    lastModifiedTimestamp: "2020-10-05T16:48:00.000Z",
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
                        groups: ["Admin"],
                    } as ApprovalList,
                } as Operation,
                {
                    operationId: "FinishedMatriculation1",
                    initiator: "MockUser4",
                    initiatedTimestamp: "2011-10-05T14:48:00.000Z",
                    lastModifiedTimestamp: "2020-10-05T16:48:00.000Z",
                    transactionInfo: {
                        contractName: UC4Identifier.CONTRACT_MATRICULATION,
                        transactionName: UC4Identifier.TRANSACTION_ADD_MATRICULATION,
                        parameters: ["SS2020", "Computer Science v3"],
                    },
                    state: OperationStatus.FINISHED,
                    reason: "",
                    existingApprovals: {
                        users: [],
                        groups: ["Admin"],
                    } as ApprovalList,
                    missingApprovals: {
                        users: [],
                        groups: [],
                    } as ApprovalList,
                } as Operation,
            ];

            onBeforeMount(async () => {
                await refresh();
                enrollmentId.value = "MockUser5";
                //enrollmentId.value = await something from store
                await getRole();
            });

            async function refresh() {
                busy.value = true;
                store.commit(MutationTypes.CLEAR_TREATED_OPERATIONS);
                await getOperations();
                busy.value = false;
            }

            async function getRole() {
                busy.value = true;
                role.value = (await store.getters.user).role;
                busy.value = false;
            }
            const filteredOperations = computed(() => {
                let filter = message.value.replace(/\s/g, "").toLowerCase();
                if (filter != "") {
                    //TODO more filtering
                    let filteredOperations = operations.value.filter((op) =>
                        op.operationId.replace(/\s/g, "").toLowerCase().includes(filter)
                    );
                    return filteredOperations;
                }
                return operations.value;
            });

            const pendingOwnOperations = computed(() =>
                filteredOperations.value.filter((op) => op.state == OperationStatus.PENDING && op.initiator == enrollmentId.value)
            );
            const finishedOperations = computed(() =>
                filteredOperations.value.filter((op) => op.state == OperationStatus.REJECTED || op.state == OperationStatus.FINISHED)
            );
            const actionNeededOperations = computed(() =>
                filteredOperations.value.filter(
                    (op) =>
                        op.state == OperationStatus.PENDING &&
                        (op.missingApprovals.users.includes(enrollmentId.value) || op.missingApprovals.groups.includes(role.value))
                )
            );
            async function getOperations() {
                //TODO API
                operations.value = mockedOps;
            }

            async function markRead(operationId: string) {
                //TODO API CALL
                // If success:
                operations.value = operations.value.filter((op) => op.operationId !== operationId);
            }

            return {
                busy,
                operations,
                pendingOwnOperations,
                finishedOperations,
                actionNeededOperations,
                enrollmentId,
                role,
                message,
                getOperations,
                markRead,
                refresh,
            };
        },
    };
</script>
