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
    </div>
    <div v-if="busy" class="mx-auto">
        <loading-spinner />
    </div>
    <div v-else class="flex flex-col items-center justify-center w-full mt-10">
        <button v-if="!gotOps" class="btn btn-blue-primary p-4 mt-10" @click="requestData">Request Archive</button>
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
    import DashboardComponent from "@/components/common/dashboard/DashboardComponent.vue";
    import Operation, { ApprovalList } from "@/api/api_models/operation_management/Operation";
    import { UC4Identifier } from "@/api/helpers/UC4Identifier";
    import { OperationStatus } from "@/api/api_models/operation_management/OperationState";
    import Router from "@/use/router/";
    import OperationManagement from "@/api/OperationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import SearchBar from "@/components/common/SearchBar.vue";
    import { MutationTypes } from "@/use/store/mutation-types";

    export default {
        name: "AllOperationsPage",
        components: {
            LoadingSpinner,
            DashboardComponent,
            SearchBar,
        },

        setup() {
            const busy = ref(false);
            const gotOps = ref(false);
            const operations = ref([] as Operation[]);
            const watchedOperations = ref([] as Operation[]);
            const message = ref("");


            const filteredOperations = computed(() => {
                let filter = message.value.replace(/\s/g, "").toLowerCase();
                if (message.value != "") {
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

            async function requestData() {
                busy.value = true;
                await getOperations();
                busy.value = false;
            }

            async function getOperations() {
                const operationManagement = new OperationManagement();
                const handler = new GenericResponseHandler("operations");
                const response = await operationManagement.getOperations(undefined, undefined, undefined, false);
                const result = handler.handleResponse(response);
                if (result.length > 0) {
                    operations.value = result;
                    gotOps.value = true;
                }
                //watchedOperations.value = mockedWatchedOps;
                //operations.value = mockedOps;
                getWatchedOperations();
            }

            async function getWatchedOperations() {
                //TODO API CALL
                watchedOperations.value = mockedWatchedOps;
            }

            function back() {
                Router.go(-1);
            }

            async function refresh() {
                busy.value = true;
                let store = useStore();
                store.commit(MutationTypes.CLEAR_PROCESSED_OPERATIONS);
                await getOperations();
                busy.value = false;
            }

            return {
                filteredOperations,
                requestData,
                busy,
                back,
                gotOps,
                watchedOperations,
                refresh,
                message,
            };
        },
    };
</script>
