<template>
    <div class="w-full mt-5">
        <div v-if="operations.length">
            <div v-for="operation in operations" :key="operation.operationId">
                <div class="mt-2">
                    <matriculation-operation-component
                        :username="username"
                        :role="role"
                        :operation="operation"
                        :is-archive="isArchive"
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
    import Operation from "@/api/api_models/operations_management/Operation";
    import MatriculationOperationComponent from "@/components/common/dashboard/MatriculationOperationComponent.vue";

    export default {
        name: "OperationList",
        components: {
            MatriculationOperationComponent,
        },
        props: {
            operations: {
                type: Array as () => Operation[],
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
            isArchive: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ["marked-read"],
        setup(props: any, { emit }: any) {
            function markRead(id: string) {
                emit("marked-read", id);
            }

            return {
                markRead,
            };
        },
    };
</script>
