<template>
    <div class="mt-32 text-4xl text-center font-semibold text-gray-900">{{ title }}</div>
    <div class="mt-8 flex justify-center">
        <div class="w-full max-w-4xl">
            <div class="flex flex-col">
                <div class="flex flex-row w-full pt-2 mb-8">
                    <seach-bar v-model:message="message" @refresh="refresh" />
                    <router-link to="/createCourse" class="w-2/12 ml-4">
                        <button
                            id="createAccountIcon"
                            title="Add a new Course"
                            class="flex flex-row items-center justify-center w-full h-full btn-icon-green"
                        >
                            <p class="mr-3 text-lg font-semibold">Add</p>
                            <i class="inline text-2xl fas fa-calendar-plus" />
                        </button>
                    </router-link>
                </div>
                <course-type-filter v-model:selected-type="selectedType" />
            </div>
            <course-list :key="refreshKey" :show-all-courses="showAllCourses" :selected-type="selectedType" :filter="message" />

            <div class="flex justify-center mt-16">
                <router-link to="/createCourse">
                    <button id="addCourse" class="px-4 btn btn-green-primary-500">New Course</button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import CourseList from "@/components/course/list/common/CourseList.vue";
    import SeachBar from "@/components/common/SearchBar.vue";
    import { ref, watch } from "vue";
    import CourseTypeFilter from "@/components/course/list/common/CourseTypeFilter.vue";
    import { CourseType } from "@/entities/CourseType";
    import { checkPrivilege } from "@/use/helpers/PermissionHelper";
    import { Role } from "@/entities/Role";

    export default {
        name: "LecturerCourseList",
        components: {
            CourseList,
            SeachBar,
            CourseTypeFilter,
        },

        async beforeRouteEnter(_to: any, _from: any, next: any) {
            const response = await checkPrivilege(Role.LECTURER);

            if (response.allowed) {
                return next();
            }
            if (!response.authenticated) {
                return next("/login");
            }

            return next("/redirect");
        },
        props: {
            showAllCourses: {
                type: Boolean,
                required: true,
            },
        },
        setup(props: any) {
            let message = ref("");
            let refreshKey = ref(false);
            let title = ref(props.showAllCourses ? "All Courses" : "My Courses");
            watch(
                () => props.showAllCourses,
                () => {
                    title.value = props.showAllCourses ? "All Courses" : "My Courses";
                }
            );

            let selectedType = ref("All" as CourseType);

            function refresh() {
                refreshKey.value = !refreshKey.value;
            }

            return {
                refreshKey,
                refresh,
                message,
                selectedType,
                title,
            };
        },
    };
</script>
