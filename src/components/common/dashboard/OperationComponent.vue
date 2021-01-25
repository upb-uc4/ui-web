<template>
    <div
        :id="'op_' + shownOpId"
        class="flex flex-col shadow-xl bg-white hover:bg-gray-200 rounded-lg items-start p-2 sm:p-4"
        @click="toggleDetails"
    >
        <div class="flex w-full items-center justify-between sm:justify-start mb-2">
            <div class="w-full sm:flex sm:items-center">
                <div class="flex items-center">
                    <i
                        v-if="showWatchOption"
                        :id="'toggleWatch_op_' + shownOpId"
                        class="text-md hover:text-blue-600 text-blue-500 far fa-bookmark cursor-pointer"
                        :class="{ 'fas fa-bookmark': isWatched }"
                        :title="isWatched ? 'Unwatch' : 'Watch'"
                        @click.stop="toggleWatch"
                    ></i>
                    <div class="ml-1 text-xs font-semiboldtext-gray-600 uppercase">{{ type }}</div>
                    <span
                        :id="'op_state_' + shownOpId"
                        class="ml-4 inline-block px-2 text-xs font-semibold tracking-wide text-teal-800 uppercase rounded-full"
                        :class="statusColor"
                    >
                        {{ operation.state }}
                    </span>
                </div>
                <div class="flex items-center sm:ml-6">
                    <div v-if="!isRejected" class="flex mr-1" :title="'Approvals (' + missingApprovals + ' missing)'">
                        <i v-for="index in approvals" :key="index" class="text-sm text-green-400 far fa-check-circle"></i>
                        <i v-for="index in missingApprovals" :key="index" class="text-sm text-green-400 far fa-circle"></i>
                    </div>
                    <label class="text-xs text-gray-600">(updated: {{ lastUpdateTimestamp }})</label>
                </div>
            </div>
            <div v-if="!isArchive && isFinished" class="pr-2">
                <button
                    :id="'op_markRead_' + shownOpId"
                    class="btn btn-icon-blue text-xs h-6 w-6"
                    title="Mark as read"
                    @click.stop="markRead"
                >
                    <i class="fas fa-check"></i>
                </button>
            </div>
            <button
                :id="'toggleDetails_op_' + shownOpId"
                class="text-sm text-gray-700 pt-1 pr-2"
                :title="showDetails ? 'Collapse' : 'Expand'"
            >
                <i
                    v-if="showDetails"
                    :disabled="provideReason"
                    class="fas fa-chevron-up"
                    :class="{ 'cursor-not-allowed': provideReason }"
                ></i>
                <i v-else class="fas fa-chevron-down"></i>
            </button>
        </div>
        <div class="flex flex-col w-full">
            <div class="flex flex-auto w-full">
                <div class="flex flex-col w-full md:w-2/3">
                    <label id="opName" class="text-xl font-semibold leading-tight text-gray-900 flex items-center">
                        {{ title }}
                    </label>
                    <label class="mt-1 text-xs text-gray-600 flex items-center">
                        Initiated: {{ initiatedTimestamp }}
                        <p class="text-gray-500 ml-2 font-mono" :title="operation.operationId">(ID: {{ shownOpId }})</p>
                    </label>
                    <div v-if="!isMyOperation && isAdmin" class="mt-1 flex w-full justify-between">
                        <p>Initiator-ID:</p>
                        <div class="ml-4">
                            <router-link
                                v-if="username != '' && username != 'not active'"
                                :id="'routeProfile_op_' + shownOpId"
                                class="navigation-link cursor-pointer hover:underline"
                                target="_blank"
                                :to="{ name: 'profile.public', params: { username: username } }"
                            >
                                @{{ username }}
                            </router-link>
                            <p v-else>not found</p>
                        </div>
                    </div>
                </div>
                <div v-if="actionRequired && isPending" class="w-full md:w-1/3 flex justify-end items-baseline">
                    <button
                        :id="'op_approve_' + shownOpId"
                        :disabled="sentApprove"
                        :class="{ 'bg-green-700': sentApprove, 'invisible': sentReject }"
                        class="w-8 h-8 btn btn-icon-green text-xs"
                        title="Approve"
                        @click.stop="approve"
                    >
                        <i class="fas fa-check"></i>
                    </button>
                    <button
                        :id="'op_startRejection_' + shownOpId"
                        :disabled="sentReject || provideReason"
                        :class="{ 'bg-red-700': sentReject, 'invisible': sentApprove }"
                        class="ml-2 w-8 h-8 btn btn-icon-red-filled text-xs"
                        title="Reject"
                        @click.stop="toggleReasonMenu"
                    >
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div v-if="showDetails" class="flex flex-col w-full mt-4">
                <div class="flex flex-wrap mb-4">
                    <div class="flex flex-col items-start">
                        <div class="flex flex-row text-sm">
                            <p class="mr-1">Desired {{ type }}:</p>
                            <div class="lg:flex ml-4 flex flex-col">
                                <p v-for="param in params" :key="param">{{ param }}</p>
                            </div>
                        </div>
                        <div v-if="isRejected" :id="'op_rejection_reason_' + shownOpId" class="mt-1">
                            <p class="text-red-500">Rejected: {{ operation.reason }}</p>
                        </div>
                    </div>
                </div>
                <div v-if="provideReason || sentReject" class="mt-6 flex flex-col border-t border-red-700">
                    <p class="text-red-700 my-2 font-semibold">{{ sentReject ? "Reason" : "Please provide a reason for rejection" }}</p>
                    <select
                        :id="'op_select_reject_reason_' + shownOpId"
                        v-model="selectedReason"
                        :disabled="sentReject"
                        class="form-select input-select"
                    >
                        <option value="" disabled>Select a reason</option>
                        <option v-for="reason in RejectionReasons" :key="reason">{{ reason }}</option>
                    </select>
                    <input
                        v-if="selectedReason == RejectionReasons.OTHER"
                        :id="'op_written_reject_reason_' + shownOpId"
                        v-model="finalReason"
                        :disabled="sentReject"
                        class="form-input input-text mt-2"
                        placeholder="Reason for rejection"
                    />
                    <div v-if="!sentReject" class="flex justify-end mt-2">
                        <button
                            :id="'op_reject_' + shownOpId"
                            :title="finalReason == '' ? 'Please provide a reason' : 'Reject'"
                            :disabled="finalReason == ''"
                            class="btn btn-icon-red-filled text-sm h-12"
                            @click.stop="reject"
                        >
                            Reject
                        </button>
                        <button
                            :id="'op_cancelRejection_' + shownOpId"
                            class="ml-2 btn btn-icon-blue text-sm h-12"
                            @click.stop="toggleReasonMenu"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Operation from "@/api/api_models/operation_management/Operation";
    import { computed, onBeforeMount, ref, watch } from "vue";
    import { OperationStatus } from "@/api/api_models/operation_management/OperationState";
    import { useStore } from "@/use/store/store";
    import { MutationTypes } from "@/use/store/mutation-types";
    import { RejectionReasons } from "./reasons";
    import { UC4Identifier } from "@/api/helpers/UC4Identifier";
    import { showNotYetImplementedToast } from "@/use/helpers/Toasts";
    import { Role } from "@/entities/Role";
    import CertificateManagement from "@/api/CertificateManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import Router from "@/use/router";
    import { approveMatriculation, rejectOperation } from "@/api/abstractions/FrontendSigning";
    import { getOperationBadgeIdentifier, printOperation, printOperationTitle } from "@/use/helpers/OperationPrinter";

    export default {
        name: "OperationComponent",
        components: {},
        props: {
            operation: {
                type: Object as () => Operation,
                required: true,
            },
            enrollmentId: {
                type: String,
                required: true,
            },
            isArchive: {
                type: Boolean,
                required: false,
                default: false,
            },
            watched: {
                type: Boolean,
                required: false,
            },
        },
        emits: ["marked-read"],
        setup(props: any, { emit }: any) {
            const store = useStore();
            const role = ref(Role.NONE);
            const operation = ref(props.operation as Operation);
            const approvals = operation.value.existingApprovals.users.length + operation.value.existingApprovals.groups.length;
            const requiredApprovals =
                approvals + operation.value.missingApprovals.users.length + operation.value.missingApprovals.groups.length;
            const missingApprovals = requiredApprovals - approvals;

            const isRejected = operation.value.state === OperationStatus.REJECTED;
            const isPending = operation.value.state === OperationStatus.PENDING;
            const isFinished = operation.value.state === OperationStatus.FINISHED || isRejected;
            const actionRequired = computed(() => {
                return (
                    (operation.value.missingApprovals.users.includes(props.enrollmentID) ||
                        operation.value.missingApprovals.groups.includes(role.value)) &&
                    !isRejected
                );
            });

            const sentApprove = ref(store.getters.processedOperations.approved.includes(operation.value.operationId));
            const sentReject = ref(store.getters.processedOperations.rejected.includes(operation.value.operationId));
            const provideReason = ref(false);
            const selectedReason = ref("");
            const finalReason = ref("");
            const isMyOperation = operation.value.initiator == props.enrollmentId;
            const showWatchOption = !isMyOperation && isPending;

            const username = ref("...");
            const isAdmin = computed(() => {
                return role.value == Role.ADMIN;
            });

            const isWatched = ref(props.watched);

            const dateFormatOptions = {
                weekday: "short",
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            };

            const params = ref([] as string[]);
            const title = ref("");
            const shownOpId = operation.value.operationId.substring(0, 4);

            const initiatedTimestamp = new Date(operation.value.initiatedTimestamp).toLocaleString("en-US", dateFormatOptions);
            const lastUpdateTimestamp = new Date(operation.value.lastModifiedTimestamp).toLocaleString("en-US", dateFormatOptions);

            const showDetails = ref(false);

            onBeforeMount(async () => {
                await getRole();
                if (isAdmin.value) {
                    getNameByEnrollmentId();
                }
                createDisplayObjects();
            });

            const type = getOperationBadgeIdentifier(operation.value);

            const statusColor = computed(() => {
                switch ((props.operation as Operation).state) {
                    case OperationStatus.PENDING:
                        return "bg-blue-300";
                    case OperationStatus.FINISHED:
                        return "bg-green-300";
                    case OperationStatus.REJECTED:
                        return "bg-red-300";
                }
            });

            watch(selectedReason, () => {
                finalReason.value = selectedReason.value;
                if (finalReason.value == RejectionReasons.OTHER) {
                    finalReason.value = "";
                }
            });

            async function getRole() {
                role.value = await store.getters.role;
            }

            async function approve() {
                if (await approveMatriculation(operation.value)) {
                    //TODO Set watch
                    store.commit(MutationTypes.ADD_OPERATION_APPROVAL, operation.value.operationId);
                    sentApprove.value = true;
                    provideReason.value = false;
                }
            }

            function toggleReasonMenu() {
                if (!showDetails.value) {
                    toggleDetails();
                }
                selectedReason.value = "";
                finalReason.value = "";
                provideReason.value = !provideReason.value;
            }

            async function reject() {
                if (await rejectOperation(operation.value, finalReason.value)) {
                    //TODO Set watch
                    //If success
                    store.commit(MutationTypes.ADD_OPERATION_REJECTION, operation.value.operationId);
                    sentReject.value = true;
                    provideReason.value = !provideReason.value;
                    toggleDetails();
                }
            }

            function markRead() {
                emit("marked-read", props.operation.operationId);
            }

            function toggleDetails() {
                //do not expand/collapse if user selects text from the operation
                if (window.getSelection()?.toString() != "") {
                    return;
                }
                if (!provideReason.value) {
                    showDetails.value = !showDetails.value;
                }
            }

            function toggleWatch() {
                //TODO Set watch
                //isWatched.value = !isWatched.value;
                showNotYetImplementedToast();
            }

            async function getNameByEnrollmentId() {
                const certificateManagement = new CertificateManagement();
                const handler = new GenericResponseHandler(`user-id ${operation.value.initiator}`);
                const response = await certificateManagement.getUsername(operation.value.initiator);
                const result = handler.handleResponse(response);
                if (result != "") {
                    username.value = result;
                } else {
                    username.value = "not active";
                }
            }

            async function createDisplayObjects() {
                title.value = printOperationTitle(operation.value);
                params.value = await printOperation(operation.value);
            }

            return {
                statusColor,
                type,
                approvals,
                initiatedTimestamp,
                lastUpdateTimestamp,
                missingApprovals,
                isRejected,
                isFinished,
                actionRequired,
                isPending,
                approve,
                reject,
                sentApprove,
                sentReject,
                markRead,
                provideReason,
                selectedReason,
                finalReason,
                toggleReasonMenu,
                RejectionReasons,
                showDetails,
                toggleDetails,
                toggleWatch,
                isWatched,
                showWatchOption,
                isMyOperation,
                isAdmin,
                username,
                params,
                title,
                shownOpId,
            };
        },
    };
</script>
