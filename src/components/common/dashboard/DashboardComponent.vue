<template>
    <div class="w-full rounded-lg bg-gray-500 p-10 shadow-2xl" :class="{ 'h-140 overflow-y-auto': !isArchive }">
        <div class="text-xl text-center font-semibold text-gray-800">{{ title }}</div>
        <div class="sm:mt-8 flex justify-center">
            <div class="w-full max-w-4xl">
                <operation-list
                    :username="username"
                    :role="role"
                    :operations="operations"
                    :is-archive="isArchive"
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
            title: {
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
