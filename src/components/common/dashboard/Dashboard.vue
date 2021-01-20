<template>
    <h1 class="text-xl text-gray-700">In this dashboard, you find all your requested operations concerning your account.</h1>
    <div v-if="busy > 0" class="mx-auto">
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
                :watched-operations="watchedOperations"
                title="Finished Operations"
                description="Completed Operations. Marking them as read will remove them from the list."
                @marked-read="markRead"
            />
            <dashboard-component
                class="mt-5 lg:mt-0 lg:w-1/2"
                :enrollment-id="enrollmentId"
                :role="role"
                :operations="shownActionRequiredOperations"
                title="Action Required"
                description="Operations that require your approval for completion."
            />
        </div>
        <dashboard-component
            :watched-operations="watchedOperations"
            :enrollment-id="enrollmentId"
            :role="role"
            :operations="pendingOwnOperations"
            title="Pending Operations"
            description="Your pending operations that wait for approval."
        />
        <button v-if="isAdmin" class="btn btn-blue-primary mt-8 p-2" @click="routeAllOperationsPage">Show all operations</button>
    </div>
</template>

<script lang="ts">
    import { computed, onBeforeMount, ref } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import Operation, { ApprovalList } from "@/api/api_models/operation_management/Operation";
    import { UC4Identifier } from "@/api/helpers/UC4Identifier";
    import { OperationStatus } from "@/api/api_models/operation_management/OperationState";
    import DashboardComponent from "@/components/common/dashboard/DashboardComponent.vue";
    import { useStore } from "@/use/store/store";
    import SeachBar from "@/components/common/SearchBar.vue";
    import { MutationTypes } from "@/use/store/mutation-types";
    import { Role } from "@/entities/Role";
    import Router from "@/use/router";
    import CertificateManagement from "@/api/CertificateManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import OperationManagement from "@/api/OperationManagement";

    export default {
        name: "Dashboard",
        components: {
            LoadingSpinner,
            DashboardComponent,
            SeachBar,
        },
        setup() {
            const busy = ref(0);
            const message = ref("");
            const operations = ref([] as Operation[]);
            const actionRequiredOperations = ref([] as Operation[]);
            const watchedOperations = ref([] as Operation[]);
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
                        parameters: "SS2020 Computer Science v3",
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
                        parameters: "SS2019 Computer Science v4",
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
                        parameters: "SS2020 Computer Science v3",
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
                        parameters: "SS2020 Computer Science v3",
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

            let mockedWatchedOps = [
                {
                    operationId: "FinishedMatriculation1",
                    initiator: "MockUser4",
                    initiatedTimestamp: "2011-10-05T14:48:00.000Z",
                    lastModifiedTimestamp: "2020-10-05T16:48:00.000Z",
                    transactionInfo: {
                        contractName: UC4Identifier.CONTRACT_MATRICULATION,
                        transactionName: UC4Identifier.TRANSACTION_ADD_MATRICULATION,
                        parameters: "SS2020 Computer Science v3",
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
                await getEnrollmentId();
                await getRole();
            });

            const isAdmin = computed(() => {
                return role.value == Role.ADMIN;
            });

            async function refresh() {
                busy.value++;
                store.commit(MutationTypes.CLEAR_TREATED_OPERATIONS);
                await getOperations();
                busy.value--;
            }

            async function getRole() {
                busy.value++;
                role.value = (await store.getters.user).role;
                busy.value--;
            }

            async function getEnrollmentId() {
                busy.value++;
                const certificateManagement = new CertificateManagement();
                const handler = new GenericResponseHandler("enrollment-id");
                const response = await certificateManagement.getOwnEnrollmentId();
                const result = handler.handleResponse(response);
                if (result) {
                    enrollmentId.value = result.id;
                }
                busy.value--;
            }

            function filterOperations(ops: Operation[], filter: string): Operation[] {
                if (filter != "") {
                    //TODO more filtering
                    let filteredOperations = ops.filter(
                        (op) =>
                            op.operationId.replace(/\s/g, "").toLowerCase().includes(filter) ||
                            op.initiator.replace(/\s/g, "").toLowerCase().includes(filter) ||
                            op.transactionInfo.parameters.toString().replace(/\s/g, "").toLowerCase().includes(filter)
                    );
                    return filteredOperations;
                }
                return ops;
            }
            const filteredOperations = computed(() => {
                let filter = message.value.replace(/\s/g, "").toLowerCase();
                if (filter != "") {
                    //TODO more filtering
                    let filteredOperations = operations.value.filter(
                        (op) =>
                            op.operationId.replace(/\s/g, "").toLowerCase().includes(filter) ||
                            op.initiator.replace(/\s/g, "").toLowerCase().includes(filter) ||
                            op.transactionInfo.parameters.toString().replace(/\s/g, "").toLowerCase().includes(filter)
                    );
                    return filteredOperations;
                }
                return operations.value;
            });

            const pendingOwnOperations = computed(() => {
                let filter = message.value.replace(/\s/g, "").toLowerCase();
                return filterOperations(operations.value, filter).filter(
                    (op) => op.state == OperationStatus.PENDING && op.initiator == enrollmentId.value
                );
            });
            const finishedOperations = computed(() => {
                let filter = message.value.replace(/\s/g, "").toLowerCase();
                return filterOperations(operations.value, filter).filter(
                    (op) => op.state == OperationStatus.REJECTED || op.state == OperationStatus.FINISHED
                );
            });
            const shownActionRequiredOperations = computed(() => {
                let filter = message.value.replace(/\s/g, "").toLowerCase();
                return filterOperations(actionRequiredOperations.value, filter).filter(
                    (op) =>
                        op.state == OperationStatus.PENDING &&
                        (op.missingApprovals.users.includes(enrollmentId.value) || op.missingApprovals.groups.includes(role.value))
                );
            });

            async function getOperations() {
                busy.value++;
                const operationManagement = new OperationManagement();
                const handler = new GenericResponseHandler("operations");
                let response = await operationManagement.getOperations(undefined, undefined, undefined, true);
                let result = handler.handleResponse(response);
                if (Object.keys(result).length > 0) {
                    operations.value = result;
                }
                response = await operationManagement.getOperations(undefined, true, undefined, undefined);
                result = handler.handleResponse(response);
                if (Object.keys(result).length > 0) {
                    actionRequiredOperations.value = result;
                }
                //watchedOperations.value = mockedWatchedOps;
                //operations.value = mockedOps;
                busy.value--;
            }

            async function markRead(operationId: string) {
                //TODO API CALL
                const operationManagement = new OperationManagement();
                const handler = new GenericResponseHandler("unwatch operation");
                const result = handler.handleResponse(await operationManagement.unwatchOperation(operationId));
                if (result) {
                    operations.value = operations.value.filter((op) => op.operationId !== operationId);
                }
            }

            function routeAllOperationsPage() {
                Router.push({ name: "operations.all" });
            }

            return {
                busy,
                operations,
                watchedOperations,
                pendingOwnOperations,
                finishedOperations,
                shownActionRequiredOperations,
                enrollmentId,
                role,
                message,
                getOperations,
                markRead,
                refresh,
                isAdmin,
                routeAllOperationsPage,
            };
        },
    };
</script>
