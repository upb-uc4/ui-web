<template>
    <base-view>
        <button class="flex items-center mb-4 navigation-link mt-12" @click="back">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>
        <div class="flex flex-col items-center justify-center w-full">
            <h1 class="text-4xl font-semibold text-blue-700 mb-10">Operations</h1>
            <h2 class="text-xl text-gray-700 dark:text-gray-400">
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
            <div class="w-full flex flex-col">
                <search-bar v-model:message="message" @refresh="getOperations" />
                <dashboard-component
                    identifier="operations_all"
                    class="w-full mt-5"
                    :operations="filteredOperations"
                    :watched-operations="watchedOperations"
                    title="All Ongoing Operations"
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
    import Router from "@/use/router/";
    import OperationManagement from "@/api/OperationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import SearchBar from "@/components/common/SearchBar.vue";
    import filterOperations from "@/use/helpers/filterOperations";
    import CertificateManagement from "@/api/CertificateManagement";
    import BaseView from "@/views/common/BaseView.vue";

    export default {
        name: "AllOperationsPage",
        components: {
            BaseView,
            LoadingSpinner,
            DashboardComponent,
            SearchBar,
        },

        setup() {
            const busy = ref(false);
            const operations = ref([] as Operation[]);
            const watchedOperations = ref([] as Operation[]);
            const message = ref("");

            const filteredOperations = computed(() => {
                return filterOperations(operations.value, message.value);
            });

            onBeforeMount(async () => {
                await getOperations();
            });

            async function getOperations() {
                busy.value = true;
                const promises = [];
                const operationManagement = new OperationManagement();
                const handler = new GenericResponseHandler("operations");

                promises.push(
                    operationManagement.getOperations(undefined, undefined, undefined, false).then((response) => {
                        const result = handler.handleResponse(response);
                        operations.value = result;
                    })
                );

                promises.push(
                    operationManagement.getOperations(false, undefined, undefined, true).then((response) => {
                        watchedOperations.value = handler.handleResponse(response);
                    })
                );

                const certificateManagement = new CertificateManagement();
                let ownId = "";
                promises.push(
                    certificateManagement.getOwnEnrollmentId().then((response) => {
                        ownId = handler.handleResponse(response)[0].enrollmentId;
                    })
                );
                await Promise.all(promises);
                busy.value = false;
            }

            function back() {
                Router.go(-1);
            }

            return {
                filteredOperations,
                getOperations,
                busy,
                back,
                watchedOperations,
                message,
            };
        },
    };
</script>
