<template>
    <div :id="'op_' + operation.operationId" class="flex shadow-xl">
        <div class="flex flex-col w-full p-4 sm:px-8 bg-white rounded-lg">
            <div class="flex items-center justify-between sm:justify-start">
                <div class="text-xs font-semibold tracking-wide text-gray-600 uppercase">Matriculation</div>
                <span
                    class="ml-4 inline-block px-2 text-xs font-semibold tracking-wide text-teal-800 uppercase rounded-full"
                    :class="statusColor"
                >
                    {{ operation.state }}
                </span>
                <div v-if="!isPending" class="w-full flex items-center">
                    <div v-if="!isRejected" class="flex ml-6" title="Approvals">
                        <i v-for="index in approvals" :key="index" class="text-sm text-green-400 far fa-check-circle"></i>
                        <i v-for="index in neededApprovals - approvals" :key="index" class="text-sm text-green-400 far fa-circle"></i>
                    </div>
                    <div class="w-full flex justify-end">
                        <button class="btn btn-icon-blue text-sm" title="Mark as read" @click="markRead">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap mb-4">
                <div class="flex flex-col items-start w-2/3">
                    <div id="opName" class="mt-2 text-xl font-semibold leading-tight text-gray-900">{{ operation.operationId }}</div>
                    <div class="flex mt-1">
                        <p class="mr-2">Initiator:</p>
                        <router-link
                            id="showLecturer"
                            :to="{ name: 'profile.public', params: { username: operation.initiator } }"
                            class="navigation-link hover:cursor-pointer hover:underline"
                        >
                            {{ operation.initiator }}
                        </router-link>
                    </div>
                </div>
                <div v-if="actionRequired && isPending" class="w-full md:w-1/3 flex justify-end">
                    <button
                        :id="'op_' + operation.operationId + '_approve'"
                        :disabled="sentApprove"
                        :class="{ 'bg-green-700': sentApprove, 'invisible': sentReject }"
                        class="w-10 h-10 btn btn-icon-green"
                        title="Approve"
                        @click="approve"
                    >
                        <i class="fas fa-check"></i>
                    </button>
                    <button
                        :id="'op_' + operation.operationId + '_approve'"
                        :disabled="sentReject || provideReason"
                        :class="{ 'bg-red-700': sentReject, 'invisible': sentApprove }"
                        class="ml-2 w-10 h-10 btn btn-icon-red-filled"
                        title="Reject"
                        @click="toogleReasonMenu"
                    >
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="flex flex-row text-sm">
                <p class="mr-1">Desired Matriculation:</p>
                <p v-for="param in operation.transactionInfo.parameters" :key="param" class="ml-4">{{ param }}</p>
            </div>
            <div v-if="isRejected" class="mt-1">
                <p class="text-red-500">Rejected: {{ operation.reason }}</p>
            </div>
            <div v-if="provideReason" class="mt-3 flex flex-col">
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
                        @click="reject"
                    >
                        Reject
                    </button>
                    <button class="ml-2 btn btn-icon-blue text-sm h-12" @click="toogleReasonMenu">Cancel</button>
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

    export default {
        name: "MatriculatioOperationComponent",
        components: {},
        props: {
            operation: {
                type: Object as () => Operation,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                required: true,
            },
        },
        emits: ["marked-read"],
        setup(props: any, { emit }: any) {
            const store = useStore();
            const operation = ref(props.operation as Operation);
            const approvals = operation.value.existingApprovals.users.length + operation.value.existingApprovals.groups.length;
            const neededApprovals =
                approvals + operation.value.missingApprovals.users.length + operation.value.missingApprovals.groups.length;

            const isRejected = operation.value.state === OperationStatus.REJECTED;
            const isPending = operation.value.state === OperationStatus.PENDING;
            const actionRequired =
                operation.value.missingApprovals.users.includes(props.username) ||
                operation.value.missingApprovals.groups.includes(props.role);
            const sentApprove = ref(store.getters.treatedOperations.approved.includes(operation.value.operationId));
            const sentReject = ref(store.getters.treatedOperations.rejected.includes(operation.value.operationId));
            const provideReason = ref(false);
            const selectedReason = ref("");
            const writtenReason = ref("");

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
                //If success
                store.commit(MutationTypes.ADD_OPERATION_APPROVAL, operation.value.operationId);
                sentApprove.value = true;
                provideReason.value = false;
            }

            function toogleReasonMenu() {
                selectedReason.value = "";
                writtenReason.value = "";
                provideReason.value = !provideReason.value;
            }

            async function reject() {
                //TODO API Call with reason
                //If success
                store.commit(MutationTypes.ADD_OPERATION_REJECTION, operation.value.operationId);
                sentReject.value = true;
                toogleReasonMenu();
            }

            function markRead() {
                emit("marked-read", props.operation.operationId);
            }

            return {
                statusColor,
                approvals,
                neededApprovals,
                isRejected,
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
            };
        },
    };
</script>
