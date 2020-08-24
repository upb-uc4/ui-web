<template>
    <div class="mt-32 text-4xl text-center font-semibold text-gray-900">Available Courses</div>
    <div class="mt-8 flex justify-center">
        <div class="w-full max-w-4xl">
            <div class="flex flex-col">
                <div class="w-full pt-2 mb-8">
                    <seach-bar v-model:message="message" @refresh="refresh" />
                </div>
                <course-type-filter v-model:selected-type="selectedType" />
            </div>
            <courseList :key="refreshKey" :show-all-courses="true" :selected-type="selectedType" :filter="message" />
        </div>
    </div>
</template>

<script lang="ts">
    import CourseList from "@/components/CourseList.vue";
    import SeachBar from "@/components/SearchBar.vue";
    import { ref } from "vue";
    import CourseTypeFilter from "@/components/CourseTypeFilter.vue";
    import { CourseType } from "@/entities/CourseType";
    import { checkPrivilege } from "../../use/PermissionHelper";
    import { Role } from "../../entities/Role";

    export default {
        name: "StudentCourseList",
        components: {
            CourseList,
            SeachBar,
            CourseTypeFilter,
        },

        async beforeRouteEnter(_to: any, _from: any, next: any) {
            const response = await checkPrivilege(Role.STUDENT);

            if (response.allowed) {
                return next();
            }
            if (!response.authenticated) {
                return next("/login");
            }

            return next("/redirect");
        },
        setup() {
            let message = ref("");
            let refreshKey = ref(false);

            let selectedType = ref("All" as CourseType);

            function refresh() {
                refreshKey.value = !refreshKey.value;
            }
            return {
                refreshKey,
                refresh,
                message,
                selectedType,
            };
        },
    };
</script>
