<template>
    <div class="flex flex-col items-center justify-center w-full mt-12">
        <h1 class="text-4xl font-semibold text-blue-800 mb-10">Operations Archive</h1>
        <h2 class="text-xl text-gray-700">
            In this dashboard, you find all operations concerning your account. (Note: Fetching the archive can last several minutes!)
        </h2>
    </div>
    <div v-if="busy">
        <loading-spinner />
    </div>
    <div v-else class="flex flex-col items-center justify-center w-full mt-10">
        <dashboard-component :operations="operations" :role="role" title="Archived Operations" :username="username" :is-archive="true" />
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

    export default {
        name: "OperationsArchivePage",
        components: {
            LoadingSpinner,
            DashboardComponent,
        },

        async beforeRouteEnter(_from: any, _to: any, next: any) {
            const response = await checkPrivilege(Role.LECTURER, Role.STUDENT, Role.ADMIN);

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
            const username = ref("");
            const role = ref("");
            const operations = ref([] as Operation[]);

            let mockedOps = [
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
                busy.value = true;
                await getUserInfo();
                await getOperationsArchive();
                busy.value = false;
            });

            async function getUserInfo() {
                let store = useStore();
                username.value = (await store.getters.user).firstName;
                role.value = (await store.getters.user).role;
            }

            async function getOperationsArchive() {
                //TODO API CALL
                operations.value = mockedOps;
            }

            return {
                username,
                role,
                operations,
                busy,
            };
        },
    };
</script>
