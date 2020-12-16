<template>
    <div class="w-full mt-5">
        <div v-if="operations.length">
            <div v-for="operation in shownOperations" :key="operation.operationId">
                <div class="mt-2">
                    <matriculation-operation-component :username="username" :role="role" :operation="operation" />
                </div>
            </div>
        </div>
        <div v-else>
            <p class="text-gray-600 text-center">No relevant operations found.</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed } from "vue";
    import Operation from "@/api/api_models/operations_management/Operation";
    import MatriculationOperationComponent from "@/components/common/dashboard/MatriculationOperationComponent.vue";

    export default {
        name: "OperationList",
        components: {
            MatriculationOperationComponent,
        },
        props: {
            filter: {
                type: String,
                required: true,
            },
            operations: {
                type: Array,
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
            const shownOperations = computed(() => {
                let filter = (props.filter as string).toLowerCase();
                if (filter != "") {
                    //TODO more filtering
                    let filteredOperations = (props.operations as Operation[]).filter((op) => op.operationId === filter);
                    return filteredOperations;
                }
                return props.operations;
            });

            return {
                shownOperations,
            };
        },
    };
</script>
