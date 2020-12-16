<template>
    <div class="text-xl text-center font-semibold text-gray-800">{{ title }}</div>
    <div class="sm:mt-8 flex justify-center">
        <div class="w-full max-w-4xl">
            <operation-list :username="username" :role="role" :filter="message" :operations="operations" />
        </div>
    </div>
</template>

<script lang="ts">
    import OperationList from "@/components/common/dashboard/OperationList.vue";
    import SeachBar from "@/components/common/SearchBar.vue";
    import { ref } from "vue";

    export default {
        name: "LecturerCourseList",
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
        setup(props: any) {
            let message = ref("");
            let refreshKey = ref(false);

            function refresh() {
                refreshKey.value = !refreshKey.value;
            }

            return {
                refreshKey,
                refresh,
                message,
            };
        },
    };
</script>
