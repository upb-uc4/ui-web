<template>
    <h1 class="text-xl text-gray-700 dark:text-gray-400">
        In this dashboard, you find all your requested operations concerning your account.
    </h1>
    <div v-if="busy > 0" class="mx-auto">
        <loading-spinner />
    </div>
    <div v-else class="flex flex-col w-full items-center mt-10 mb-10">
        <div v-if="!hasCertificate" class="w-full flex flex-col items-center">
            <label class="text-md text-gray-700">Before you can view your dashboard, you have to create your personal certificate.</label>
            <button id="createCertificate" class="btn btn-blue-primary w-32 p-2 mt-6" @click="createCertificate">Create Certificate</button>
        </div>
        <div v-else class="w-full flex flex-col">
            <div class="flex sm:flex-row flex-col-reverse w-full">
                <search-bar v-model:message="message" @refresh="refresh" />
            </div>
            <div class="w-full my-5 xl:flex lg:justify-between">
                <dashboard-component
                    class="lg:mr-5 xl:w-1/2"
                    identifier="finished"
                    :enrollment-id="enrollmentId"
                    :operations="finishedOperations"
                    :watched-operations="watchlistOperations"
                    title="Finished Operations"
                    description="Completed Operations. Marking them as read will remove them from the list."
                    @marked-read="markRead"
                />
                <dashboard-component
                    class="mt-5 xl:mt-0 xl:w-1/2"
                    identifier="actionRequired"
                    :enrollment-id="enrollmentId"
                    :operations="shownActionRequiredOperations"
                    :watched-operations="watchlistOperations"
                    title="Action Required"
                    description="Operations that require your approval for completion."
                />
            </div>
            <dashboard-component
                identifier="pending"
                :enrollment-id="enrollmentId"
                :operations="pendingOperations"
                :watched-operations="watchlistOperations"
                title="Pending Operations"
                description="Your pending operations that wait for approval."
            />
            <button v-if="isAdmin" class="btn btn-blue-primary mt-8 p-2" @click="routeAllOperationsPage">Show all operations</button>
            <div class="w-full flex items-start mt-10">
                <label class="text-sm text-gray-700">
                    Note: You can find a complete archive of your operations
                    <router-link
                        id="showOperationsArchive"
                        :to="{ name: 'operations.archive' }"
                        class="navigation-link hover:cursor-pointer hover:underline"
                    >
                        here
                    </router-link>
                    .
                </label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, onBeforeMount, ref } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import Operation from "@/api/api_models/operation_management/Operation";
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
    import { useToast } from "@/toast";

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
            const watchlistPendingOperations = ref([] as Operation[]);
            const watchlistCompletedOperations = ref([] as Operation[]);
            const actionRequiredOperations = ref([] as Operation[]);
            const watchlistOperations = ref([] as Operation[]);
            const store = useStore();
            const hasCertificate = ref(false);
            const role = ref("");
            const enrollmentId = ref("");

            onBeforeMount(async () => {
                busy.value++;
                hasCertificate.value = await store.getters.hasCertificate;
                if (hasCertificate.value) {
                    await loadDashboard();
                }
                busy.value--;
            });

            async function loadDashboard() {
                const promises = [];
                promises.push(refresh());
                promises.push(getEnrollmentId());
                promises.push(getRole());
                await Promise.all(promises);
            }

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
                if (result.length !== 0) {
                    enrollmentId.value = result[0].enrollmentId;
                }
                busy.value--;
            }

            const pendingOperations = computed(() => {
                return filterOperations(watchlistPendingOperations.value, message.value);
            });
            const finishedOperations = computed(() => {
                return filterOperations(watchlistCompletedOperations.value, message.value);
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
                const promises = [];
                const operationManagement = new OperationManagement();
                const handler = new GenericResponseHandler("operations");

                //Get pending operations from watchlist
                promises.push(
                    operationManagement.getOperations(undefined, undefined, [OperationStatus.PENDING], true).then((response) => {
                        let result = handler.handleResponse(response);
                        watchlistPendingOperations.value = result;
                    })
                );

                // Get completed operations
                promises.push(
                    operationManagement
                        .getOperations(undefined, undefined, [OperationStatus.FINISHED, OperationStatus.REJECTED], true)
                        .then((response) => {
                            let result = handler.handleResponse(response);
                            watchlistCompletedOperations.value = result;
                        })
                );

                //Get action required operations
                promises.push(
                    operationManagement.getOperations(undefined, true, undefined, undefined).then((response) => {
                        let result = handler.handleResponse(response);
                        actionRequiredOperations.value = result;
                    })
                );

                //Get not-selfinitiated operations from watchlist
                promises.push(
                    operationManagement.getOperations(false, undefined, undefined, true).then((response) => {
                        const result = handler.handleResponse(response);
                        watchlistOperations.value = result;
                    })
                );

                await Promise.all(promises);
                watchlistPendingOperations.value = watchlistPendingOperations.value.filter(
                    (op) => !actionRequiredOperations.value.some((op2) => op.operationId == op2.operationId)
                );
                busy.value--;
            }

            async function markRead(operationId: string) {
                const operationManagement = new OperationManagement();
                const handler = new GenericResponseHandler("unwatch operation");
                const result = handler.handleResponse(await operationManagement.unwatchOperation(operationId));
                if (result) {
                    watchlistCompletedOperations.value = watchlistCompletedOperations.value.filter((op) => op.operationId !== operationId);
                }
            }

            function routeAllOperationsPage() {
                Router.push({ name: "operations.all" });
            }

            async function createCertificate() {
                busy.value++;
                let certificate = "";
                await store.getters
                    .certificate()
                    .then((cert) => {
                        certificate = cert.certificate;
                    })
                    .catch((reason) => {
                        const toast = useToast();
                        toast.warning("Certificate creation aborted.");
                    });
                if (certificate != "") {
                    hasCertificate.value = true;
                    // wait for Lagom
                    await new Promise((r) => setTimeout(r, 3000));
                    await loadDashboard();
                }
                busy.value--;
            }

            return {
                busy,
                hasCertificate,
                pendingOperations,
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
                createCertificate,
                watchlistOperations,
            };
        },
    };
</script>
