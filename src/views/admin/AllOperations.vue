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
        <button v-if="!gotOps" class="btn btn-blue-primary p-4 mt-10" @click="requestData">Request Operations</button>
        <div v-else class="w-full flex flex-col">
            <search-bar v-model:message="message" @refresh="refresh" />
            <dashboard-component
                identifier="archive"
                class="w-full mt-5"
                :operations="filteredOperations"
                :watched-operations="watchedOperations"
                title="Archived Operations"
                :is-archive="true"
            />
        </div>
    </div>
</template>
<script lang="ts">
    import { useStore } from "@/use/store/store";
    import { ref, computed } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import DashboardComponent from "@/components/common/dashboard/DashboardComponent.vue";
    import Operation from "@/api/api_models/operation_management/Operation";
    import Router from "@/use/router/";
    import OperationManagement from "@/api/OperationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import SearchBar from "@/components/common/SearchBar.vue";
    import { MutationTypes } from "@/use/store/mutation-types";
    import filterOperations from "@/use/helpers/filterOperations";
    import CertificateManagement from "@/api/CertificateManagement";

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
                return filterOperations(operations.value, message.value);
            });

            async function requestData() {
                busy.value = true;
                await getOperations();
                busy.value = false;
            }

            async function getOperations() {
                const promises = [];
                const operationManagement = new OperationManagement();
                const handler = new GenericResponseHandler("operations");

                promises.push(
                    operationManagement.getOperations(undefined, undefined, undefined, false).then((response) => {
                        const result = handler.handleResponse(response);
                        operations.value = result;
                    })
                );

                let tmpOps = [] as Operation[];
                promises.push(
                    operationManagement.getOperations(undefined, undefined, undefined, true).then((response) => {
                        tmpOps = handler.handleResponse(response);
                    })
                );

                const certificateManagement = new CertificateManagement();
                let ownId = "";
                promises.push(
                    certificateManagement.getOwnEnrollmentId().then((response) => {
                        ownId = handler.handleResponse(response).id;
                    })
                );
                await Promise.all(promises);
                gotOps.value = true;
                watchedOperations.value = tmpOps.filter((op) => op.initiator != ownId);
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
