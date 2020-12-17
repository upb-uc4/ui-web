<template>
    <div class="text-xl text-center font-semibold text-gray-800">{{ title }}</div>
    <div class="sm:mt-8 flex justify-center">
        <div class="w-full max-w-4xl">
            <operation-list :username="username" :role="role" :operations="operations" @marked-read="markRead" />
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
