<template>
    <h1 class="text-xl text-gray-700">In this dashboard, you find all your requested operations concerning your account.</h1>
    <div v-if="busy > 0" class="mx-auto">
        <loading-spinner />
    </div>
    <div v-else class="flex flex-col w-full items-center mt-10">
        <div class="flex sm:flex-row flex-col-reverse w-full">
            <search-bar v-model:message="message" @refresh="refresh" />
        </div>
        <div class="w-full my-5 lg:flex lg:justify-between">
            <dashboard-component
                class="lg:mr-5 lg:w-1/2"
                identifier="finished"
                :enrollment-id="enrollmentId"
                :operations="finishedOperations"
                title="Finished Operations"
                description="Completed Operations. Marking them as read will remove them from the list."
                @marked-read="markRead"
            />
            <dashboard-component
                class="mt-5 lg:mt-0 lg:w-1/2"
                identifier="actionRequired"
                :enrollment-id="enrollmentId"
                :operations="shownActionRequiredOperations"
                title="Action Required"
                description="Operations that require your approval for completion."
            />
        </div>
        <dashboard-component
            identifier="pending"
            :enrollment-id="enrollmentId"
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
    import SearchBar from "@/components/common/SearchBar.vue";
    import { MutationTypes } from "@/use/store/mutation-types";
    import { Role } from "@/entities/Role";
    import Router from "@/use/router";
    import CertificateManagement from "@/api/CertificateManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import OperationManagement from "@/api/OperationManagement";
    import filterOperations from "@/use/helpers/filterOperations";

    export default {
        name: "Dashboard",
        components: {
            LoadingSpinner,
            DashboardComponent,
            SearchBar,
        },
        setup() {
            const busy = ref(0);
            const message = ref("");
            const watchlistOperations = ref([] as Operation[]);
            const actionRequiredOperations = ref([] as Operation[]);
            const store = useStore();
            const role = ref("");
            const enrollmentId = ref("");

            onBeforeMount(async () => {
                const promises = [];
                promises.push(refresh());
                promises.push(getEnrollmentId());
                promises.push(getRole());
                await Promise.all(promises);
            });

            const isAdmin = computed(() => {
                return role.value == Role.ADMIN;
            });

            async function refresh() {
                busy.value++;
                store.commit(MutationTypes.CLEAR_PROCESSED_OPERATIONS);
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

            const pendingOwnOperations = computed(() => {
                return filterOperations(watchlistOperations.value, message.value).filter(
                    (op) => op.state == OperationStatus.PENDING && op.initiator == enrollmentId.value
                );
            });
            const finishedOperations = computed(() => {
                return filterOperations(watchlistOperations.value, message.value).filter(
                    (op) => op.state == OperationStatus.REJECTED || op.state == OperationStatus.FINISHED
                );
            });
            const shownActionRequiredOperations = computed(() => {
                return filterOperations(actionRequiredOperations.value, message.value).filter(
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
                    watchlistOperations.value = result;
                }
                response = await operationManagement.getOperations(undefined, true, undefined, undefined);
                result = handler.handleResponse(response);
                if (Object.keys(result).length > 0) {
                    actionRequiredOperations.value = result;
                }
                busy.value--;
            }

            async function markRead(operationId: string) {
                //TODO API CALL
                const operationManagement = new OperationManagement();
                const handler = new GenericResponseHandler("unwatch operation");
                const result = handler.handleResponse(await operationManagement.unwatchOperation(operationId));
                if (result) {
                    watchlistOperations.value = watchlistOperations.value.filter((op) => op.operationId !== operationId);
                }
            }

            function routeAllOperationsPage() {
                Router.push({ name: "operations.all" });
            }

            return {
                busy,
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
