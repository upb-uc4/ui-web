<template>
    <button class="flex items-center mb-4 navigation-link mt-12" @click="back">
        <i class="fas text-xl fa-chevron-left"></i>
        <span class="font-bold text-sm ml-1">Back</span>
    </button>
    <div class="flex flex-col items-center justify-center w-full">
        <h1 class="text-4xl font-semibold text-blue-800 mb-10">Operations Archive</h1>
        <h2 class="text-xl text-gray-700">In this dashboard, you find all operations concerning your account.</h2>
    </div>
    <div v-if="busy">
        <loading-spinner />
    </div>
    <div v-else class="flex flex-col items-center justify-center w-full mt-10">
        <button v-if="!gotArchive" class="btn btn-blue-primary p-4 mt-10" @click="requestData">Request Archive</button>
        <div v-else class="w-full flex flex-col">
            <search-bar v-model:message="message" @refresh="refresh" />
            <dashboard-component
                identifier="archive"
                class="w-full mt-5"
                :operations="filteredOperations"
                title="Archived Operations"
                :is-archive="true"
            />
        </div>
    </div>
</template>
<script lang="ts">
    import { useStore } from "@/use/store/store";
    import { ref, onBeforeMount, computed } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import { checkPrivilege } from "@/use/helpers/PermissionHelper";
    import { Role } from "@/entities/Role";
    import DashboardComponent from "@/components/common/dashboard/DashboardComponent.vue";
    import Operation, { ApprovalList } from "@/api/api_models/operation_management/Operation";
    import { UC4Identifier } from "@/api/helpers/UC4Identifier";
    import { OperationStatus } from "@/api/api_models/operation_management/OperationState";
    import Router from "@/use/router/";
    import { showNotYetImplementedToast } from "@/use/helpers/Toasts";
    import OperationManagement from "@/api/OperationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { MutationTypes } from "@/use/store/mutation-types";
    import SearchBar from "@/components/common/SearchBar.vue";
    import filterOperations from "@/use/helpers/filterOperations";

    export default {
        name: "OperationsArchivePage",
        components: {
            LoadingSpinner,
            DashboardComponent,
            SearchBar,
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
            const gotArchive = ref(false);
            const operations = ref([] as Operation[]);
            const message = ref("");

            const filteredOperations = computed(() => {
                return filterOperations(operations.value, message.value);
            });

            async function requestData() {
                busy.value = true;
                await getOperationsArchive();
                busy.value = false;
            }

            async function getOperationsArchive() {
                const operationManagement = new OperationManagement();
                const handler = new GenericResponseHandler("operations");
                let response = await operationManagement.getOperations(
                    true,
                    undefined,
                    [OperationStatus.FINISHED, OperationStatus.REJECTED],
                    false
                );
                let result = handler.handleResponse(response);

                //Show empty archive if no results given
                operations.value = result;
                gotArchive.value = true;
            }

            function back() {
                Router.go(-1);
            }

            async function refresh() {
                busy.value = true;
                let store = useStore();
                store.commit(MutationTypes.CLEAR_PROCESSED_OPERATIONS);
                await getOperationsArchive();
                busy.value = false;
            }

            return {
                requestData,
                busy,
                back,
                gotArchive,
                refresh,
                message,
                filteredOperations,
            };
        },
    };
</script>
