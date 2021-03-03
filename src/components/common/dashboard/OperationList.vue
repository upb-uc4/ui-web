<template>
    <div class="w-full mt-5">
        <div v-if="operations.length">
            <div v-for="operation in operations" :key="operation.operationId">
                <div class="mt-2">
                    <operation-component
                        :enrollment-id="enrollmentId"
                        :operation="operation"
                        :is-archive="isArchive"
                        :watched="isWatched(operation)"
                        @marked-read="markRead"
                    />
                </div>
            </div>
        </div>
        <list-placeholder v-else content-type="operations" />
    </div>
</template>

<script lang="ts">
    import Operation from "@/api/api_models/operation_management/Operation";
    import OperationComponent from "@/components/common/dashboard/OperationComponent.vue";
    import ListPlaceholder from "@/components/common/ListPlaceholder.vue";

    export default {
        name: "OperationList",
        components: {
            OperationComponent,
            ListPlaceholder,
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
                return (props.watchedOperations as Operation[]).some((op) => op.operationId === operation.operationId);
            }

            return {
                markRead,
                isWatched,
            };
        },
    };
</script>
