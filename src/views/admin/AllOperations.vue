<template>
    <button class="flex items-center mb-4 navigation-link mt-12" @click="back">
        <i class="fas text-xl fa-chevron-left"></i>
        <span class="font-bold text-sm ml-1">Back</span>
    </button>
    <div class="flex flex-col items-center justify-center w-full">
        <h1 class="text-4xl font-semibold text-blue-800 mb-10">Operations</h1>
        <h2 class="text-xl text-gray-700">
            In this dashboard, you find all operations in the system. You may watch them for displaying them in your personal dashboard
            <router-link id="routeWelcomePage" :to="{ name: 'welcome' }" class="navigation-link hover:cursor-pointer hover:underline">
                here
            </router-link>
            .
        </h2>
        <button v-if="!gotOps" class="btn btn-blue-primary p-4 mt-10" @click="requestData">Request Operations</button>
    </div>
    <div v-if="busy">
        <loading-spinner />
    </div>
    <div v-else-if="gotOps" class="flex flex-col items-center justify-center w-full mt-10">
        <dashboard-component
            class="w-full"
            :watched-operations="watchedOperations"
            :operations="operations"
            :role="role"
            title="All Operations"
        />
    </div>
</template>
<script lang="ts">
    import { useStore } from "@/use/store/store";
    import { ref, onBeforeMount } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import { checkPrivilege } from "@/use/helpers/PermissionHelper";
    import { Role } from "@/entities/Role";
    import DashboardComponent from "@/components/common/dashboard/DashboardComponent.vue";
    import Operation, { ApprovalList } from "@/api/api_models/operations_management/Operation";
    import { UC4Identifier } from "@/api/helpers/UC4Identifier";
    import { OperationStatus } from "@/api/api_models/operations_management/OperationState";
    import Router from "@/use/router/";

    export default {
        name: "AllOperationsPage",
        components: {
            LoadingSpinner,
            DashboardComponent,
        },

        async beforeRouteEnter(_from: any, _to: any, next: any) {
            const response = await checkPrivilege(Role.ADMIN);

            if (response.allowed) {
                return next();
            }
            if (!response.authenticated) {
                return next("/login");
            }

            return next("/redirect");
        },

        setup() {
            const busy = ref(false);
            const gotOps = ref(false);
            const role = ref("");
            const operations = ref([] as Operation[]);
            const watchedOperations = ref([] as Operation[]);

            let mockedOps = [
                {
                    operationId: "PendingMatriculation2",
                    initiator: "MockUser3",
                    initiatedTimestamp: "2011-10-05T14:48:00.000Z",
                    lastModifiedTimestamp: "2020-10-05T16:48:00.000Z",
                    transactionInfo: {
                        contractName: UC4Identifier.CONTRACT_MATRICULATION,
                        transactionName: UC4Identifier.TRANSACTION_ADD_MATRICULATION,
                        parameters: "SS2020 Computer Science v3",
                    },
                    state: OperationStatus.PENDING,
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
                    operationId: "PendingMatriculation1",
                    initiator: "MockUser4",
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
                        groups: ["admin"],
                    } as ApprovalList,
                    missingApprovals: {
                        users: [],
                        groups: [],
                    } as ApprovalList,
                } as Operation,
            ];

            let mockedWatchedOps = [
                {
                    operationId: "PendingMatriculation1",
                    initiator: "MockUser4",
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
                        groups: ["admin"],
                    } as ApprovalList,
                    missingApprovals: {
                        users: [],
                        groups: [],
                    } as ApprovalList,
                } as Operation,
            ];

            async function requestData() {
                busy.value = true;
                await getUserInfo();
                await getOperations();
                busy.value = false;
            }

            async function getUserInfo() {
                let store = useStore();
                role.value = (await store.getters.user).role;
            }

            async function getOperations() {
                //TODO API CALL
                getWatchedOperations();
                gotOps.value = true;
                operations.value = mockedOps;
            }

            async function getWatchedOperations() {
                //TODO API CALL
                watchedOperations.value = mockedWatchedOps;
            }

            function back() {
                Router.go(-1);
            }

            return {
                role,
                operations,
                requestData,
                busy,
                back,
                gotOps,
                watchedOperations,
            };
        },
    };
</script>
