<template>
    <div class="w-full mt-5">
        <div v-if="operations.length">
            <div v-for="operation in operations" :key="operation.operationId">
                <div class="mt-2">
                    <operation-component
                        :enrollment-id="enrollmentId"
                        :role="role"
                        :operation="operation"
                        :is-archive="isArchive"
                        :watched="isWatched(operation)"
                        @marked-read="markRead"
                    />
                </div>
            </div>
        </div>
        <div v-else>
            <p class="text-gray-700 text-center">No relevant operations found.</p>
        </div>
    </div>
</template>

<script lang="ts">
    import Operation from "@/api/api_models/operation_management/Operation";
    import OperationComponent from "@/components/common/dashboard/OperationComponent.vue";

    export default {
        name: "OperationList",
        components: {
            OperationComponent,
        },
        props: {
            operations: {
                type: Array as () => Operation[],
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
            watchedOperations: {
                type: Array,
                required: false,
                default: () => [],
            },
        },
        emits: ["marked-read"],
        setup(props: any, { emit }: any) {
            function markRead(id: string) {
                emit("marked-read", id);
            }

            function isWatched(operation: Operation) {
                return (props.watchedOperations as Operation[]).find((op) => op.operationId === operation.operationId) != undefined;
            }

            return {
                markRead,
                isWatched,
            };
        },
    };
</script>
