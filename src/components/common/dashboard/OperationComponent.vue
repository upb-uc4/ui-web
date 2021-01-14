<template>
    <div
        :id="'op_' + operation.operationId"
        class="flex flex-col shadow-xl bg-white hover:bg-gray-200 rounded-lg items-start p-2 sm:p-4"
        @click="toggleDetails"
    >
        <div class="flex w-full items-center justify-between sm:justify-start mb-4">
            <div class="w-full sm:flex sm:items-center">
                <div class="flex items-center">
                    <i
                        v-if="showWatchOption"
                        class="text-md hover:text-blue-600 text-blue-500 far fa-bookmark cursor-pointer"
                        :class="{ 'fas fa-bookmark': isWatched }"
                        :title="isWatched ? 'Unwatch' : 'Watch'"
                        @click.stop="toggleWatch"
                    ></i>
                    <div class="ml-1 text-xs font-semiboldtext-gray-600 uppercase">{{ type }}</div>
                    <span
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
                <button class="btn btn-icon-blue text-xs h-6 w-6" title="Mark as read" @click="markRead">
                    <i class="fas fa-check"></i>
                </button>
            </div>
            <button class="text-sm text-gray-700 pt-1 pr-2" :title="showDetails ? 'Collapse' : 'Expand'">
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
                <div class="flex flex-col">
                    <label id="opName" class="mt-2 text-xl font-semibold leading-tight text-gray-900">{{ operation.operationId }}</label>
                    <label class="mt-1 text-xs text-gray-600">Initiated: {{ initiatedTimestamp }}</label>
                </div>
                <div v-if="actionRequired && isPending" class="w-full flex justify-end items-baseline">
                    <button
                        :id="'op_' + operation.operationId + '_approve'"
                        :disabled="sentApprove"
                        :class="{ 'bg-green-700': sentApprove, 'invisible': sentReject }"
                        class="w-8 h-8 btn btn-icon-green text-xs"
                        title="Approve"
                        @click.stop="approve"
                    >
                        <i class="fas fa-check"></i>
                    </button>
                    <button
                        :id="'op_' + operation.operationId + '_approve'"
                        :disabled="sentReject || provideReason"
                        :class="{ 'bg-red-700': sentReject, 'invisible': sentApprove }"
                        class="ml-2 w-8 h-8 btn btn-icon-red-filled text-xs"
                        title="Reject"
                        @click.stop="toogleReasonMenu"
                    >
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div v-if="showDetails" class="flex flex-col w-full mt-4">
                <div class="flex flex-wrap mb-4">
                    <div class="flex flex-col items-start">
                        <p v-if="!isMyOperation" class="mt-1">Initiator-ID: {{ operation.initiator }}</p>
                        <div class="flex flex-row text-sm">
                            <p class="mr-1">Desired {{ type }}:</p>
                            <div class="lg:flex">
                                <p v-for="param in operation.transactionInfo.parameters" :key="param" class="ml-4">{{ param }}</p>
                            </div>
                        </div>
                        <div v-if="isRejected" class="mt-1">
                            <p class="text-red-500">Rejected: {{ operation.reason }}</p>
                        </div>
                    </div>
                </div>
                <div v-if="provideReason" class="mt-6 flex flex-col border-t border-red-700">
                    <p class="text-red-700 my-2 font-semibold">Please provide a reason for rejection</p>
                    <select v-model="selectedReason" class="form-select input-select">
                        <option value="" disabled>Select a reason</option>
                        <option v-for="reason in RejectionReasons" :key="reason">{{ reason }}</option>
                    </select>
                    <input
                        v-if="selectedReason == RejectionReasons.OTHER"
                        v-model="writtenReason"
                        class="form-input input-text mt-2"
                        placeholder="Reason for rejection"
                    />
                    <div class="flex justify-end mt-2">
                        <button
                            :title="writtenReason == '' ? 'Please provide a reason' : 'Reject'"
                            :disabled="writtenReason == ''"
                            class="btn btn-icon-red-filled text-sm h-12"
                            @click.stop="reject"
                        >
                            Reject
                        </button>
                        <button class="ml-2 btn btn-icon-blue text-sm h-12" @click.stop="toogleReasonMenu">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Operation from "@/api/api_models/operations_management/Operation";
    import { computed, ref, watch } from "vue";
    import { OperationStatus } from "@/api/api_models/operations_management/OperationState";
    import { useStore } from "@/use/store/store";
    import { MutationTypes } from "@/use/store/mutation-types";
    import { RejectionReasons } from "./reasons";
    import { UC4Identifier } from "@/api/helpers/UC4Identifier";
    import { showNotYetImplementedToast } from "@/use/helpers/Toasts";

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
            role: {
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
            const operation = ref(props.operation as Operation);
            const approvals = operation.value.existingApprovals.users.length + operation.value.existingApprovals.groups.length;
            const neededApprovals =
                approvals + operation.value.missingApprovals.users.length + operation.value.missingApprovals.groups.length;
            const missingApprovals = neededApprovals - approvals;

            const isRejected = operation.value.state === OperationStatus.REJECTED;
            const isPending = operation.value.state === OperationStatus.PENDING;
            const isFinished = operation.value.state === OperationStatus.FINISHED || isRejected;
            const actionRequired =
                (operation.value.missingApprovals.users.includes(props.enrollmentID) ||
                    operation.value.missingApprovals.groups.includes(props.role)) &&
                !isRejected;

            const sentApprove = ref(store.getters.treatedOperations.approved.includes(operation.value.operationId));
            const sentReject = ref(store.getters.treatedOperations.rejected.includes(operation.value.operationId));
            const provideReason = ref(false);
            const selectedReason = ref("");
            const writtenReason = ref("");
            const isMyOperation = operation.value.initiator == props.enrollmentId;
            const showWatchOption = !isMyOperation && !props.isArchive;

            const isWatched = ref(props.watched);

            const dateFormatOptions = {
                weekday: "short",
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            };

            const initiatedTimestamp = new Date(operation.value.initiatedTimestamp).toLocaleString("en-US", dateFormatOptions);
            const lastUpdateTimestamp = new Date(operation.value.lastModifiedTimestamp).toLocaleString("en-US", dateFormatOptions);

            const showDetails = ref(false);

            const type = computed(() => {
                if (operation.value.transactionInfo.contractName == UC4Identifier.CONTRACT_MATRICULATION) {
                    return "Matriculation";
                }
                return "";
            });

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
                writtenReason.value = selectedReason.value;
                if (writtenReason.value == RejectionReasons.OTHER) {
                    writtenReason.value = "";
                }
            });

            async function approve() {
                //TODO API Call
                //TODO Set watch
                //If success
                store.commit(MutationTypes.ADD_OPERATION_APPROVAL, operation.value.operationId);
                sentApprove.value = true;
                provideReason.value = false;
            }

            function toogleReasonMenu() {
                if (!showDetails.value) {
                    toggleDetails();
                }
                selectedReason.value = "";
                writtenReason.value = "";
                provideReason.value = !provideReason.value;
            }

            async function reject() {
                //TODO API Call with reason
                //TODO Set watch
                //If success
                store.commit(MutationTypes.ADD_OPERATION_REJECTION, operation.value.operationId);
                sentReject.value = true;
                toogleReasonMenu();
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

            return {
                statusColor,
                type,
                approvals,
                initiatedTimestamp,
                lastUpdateTimestamp,
                neededApprovals,
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
                writtenReason,
                toogleReasonMenu,
                RejectionReasons,
                showDetails,
                toggleDetails,
                toggleWatch,
                isWatched,
                showWatchOption,
                isMyOperation,
            };
        },
    };
</script>
