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
                <div v-if="!isRejected" class="flex ml-6" title="Approvals">
                    <i v-for="index in approvals" :key="index" class="text-sm text-green-400 far fa-check-circle"></i>
                    <i v-for="index in neededApprovals - approvals" :key="index" class="text-sm text-green-400 far fa-circle"></i>
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
                        :disabled="sentReject"
                        :class="{ 'bg-red-700': sentReject, 'invisible': sentApprove }"
                        class="ml-2 w-10 h-10 btn btn-icon-red-filled"
                        title="Reject"
                        @click="reject"
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
        </div>
    </div>
</template>

<script lang="ts">
    import Operation from "@/api/api_models/operations_management/Operation";
    import { computed, ref } from "vue";
    import { OperationStatus } from "@/api/api_models/operations_management/OperationState";

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
        setup(props: any) {
            const operation = ref(props.operation as Operation);
            const approvals = operation.value.existingApprovals.users.length + operation.value.existingApprovals.groups.length;
            const neededApprovals =
                approvals + operation.value.missingApprovals.users.length + operation.value.missingApprovals.groups.length;

            const isRejected = operation.value.state === OperationStatus.REJECTED;
            const isPending = operation.value.state === OperationStatus.PENDING;
            const actionRequired =
                operation.value.missingApprovals.users.includes(props.username) ||
                operation.value.missingApprovals.groups.includes(props.role);
            const sentApprove = ref(false);
            const sentReject = ref(false);

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

            async function approve() {
                //TODO
                sentApprove.value = true;
            }

            async function reject() {
                //TODO
                sentReject.value = true;
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
            };
        },
    };
</script>
