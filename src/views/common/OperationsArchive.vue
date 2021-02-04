<template>
    <base-view>
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
            <div class="w-full flex flex-col">
                <search-bar v-model:message="message" @refresh="getOperationsArchive" />
                <dashboard-component
                    identifier="archive"
                    class="w-full mt-5"
                    :operations="filteredOperations"
                    title="Archived Operations"
                    :is-archive="true"
                />
            </div>
        </div>
    </base-view>
</template>
<script lang="ts">
    import { ref, computed, onBeforeMount } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import DashboardComponent from "@/components/common/dashboard/DashboardComponent.vue";
    import Operation from "@/api/api_models/operation_management/Operation";
    import { OperationStatus } from "@/api/api_models/operation_management/OperationState";
    import Router from "@/use/router/";
    import OperationManagement from "@/api/OperationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import SearchBar from "@/components/common/SearchBar.vue";
    import filterOperations from "@/use/helpers/filterOperations";
    import BaseView from "@/views/common/BaseView.vue";

    export default {
        name: "OperationsArchivePage",
        components: {
            BaseView,
            LoadingSpinner,
            DashboardComponent,
            SearchBar,
        },

        setup() {
            const busy = ref(false);
            const operations = ref([] as Operation[]);
            const message = ref("");

            const filteredOperations = computed(() => {
                return filterOperations(operations.value, message.value);
            });

            onBeforeMount(async () => {
                await getOperationsArchive();
            });

            async function getOperationsArchive() {
                busy.value = true;
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
                busy.value = false;
            }

            function back() {
                Router.go(-1);
            }

            return {
                getOperationsArchive,
                busy,
                back,
                message,
                filteredOperations,
            };
        },
    };
</script>
