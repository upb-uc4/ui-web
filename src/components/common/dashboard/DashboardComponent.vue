<template>
    <div class="text-xl text-center font-semibold text-gray-800">{{ title }}</div>
    <div class="sm:mt-8 flex justify-center">
        <div class="w-full max-w-4xl">
            <div class="flex flex-col">
                <div class="flex sm:flex-row flex-col-reverse w-full">
                    <seach-bar v-model:message="message" @refresh="refresh" />
                </div>
            </div>
            <operation-list :key="refreshKey" :username="username" :role="role" :filter="message" :operations="operations" />
        </div>
    </div>
</template>

<script lang="ts">
    import OperationList from "@/components/common/dashboard/OperationList.vue";
    import SeachBar from "@/components/common/SearchBar.vue";
    import { ref, watch } from "vue";
    import CourseTypeFilter from "@/components/course/list/common/CourseTypeFilter.vue";
    import { CourseType } from "@/entities/CourseType";
    import { checkPrivilege } from "@/use/helpers/PermissionHelper";
    import { Role } from "@/entities/Role";

    export default {
        name: "LecturerCourseList",
        components: {
            OperationList,
            SeachBar,
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
