<template>
    <div
        :id="'dashboard_' + identifier"
        class="w-full rounded-lg bg-gray-500 p-10 shadow-2xl"
        :class="{ 'h-140 overflow-y-auto': !isArchive }"
    >
        <div class="text-xl text-center font-semibold text-gray-800">{{ title }}</div>
        <div v-if="description != ''" class="text-sm text-center text-gray-800 mt-4">{{ description }}</div>
        <div class="sm:mt-8 flex justify-center">
            <div class="w-full max-w-4xl">
                <operation-list
                    :enrollment-id="enrollmentId"
                    :role="role"
                    :operations="operations"
                    :is-archive="isArchive"
                    :watched-operations="watchedOperations"
                    @marked-read="markRead"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import OperationList from "@/components/common/dashboard/OperationList.vue";

    export default {
        name: "DashboardComponent",
        components: {
            OperationList,
        },
        props: {
            identifier: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: false,
                default: "",
            },
            operations: {
                type: Array,
                required: true,
            },
            enrollmentId: {
                type: String,
                required: false,
                default: "",
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

            return {
                markRead,
            };
        },
    };
</script>
