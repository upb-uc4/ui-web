<template>
    <div class="mt-12 sm:mt-32 text-4xl text-center font-semibold text-gray-900">{{ title }}</div>
    <div class="sm:mt-8 flex justify-center">
        <div class="w-full max-w-4xl">
            <div class="flex flex-col">
                <div class="flex sm:flex-row flex-col-reverse w-full">
                    <seach-bar v-model:message="message" class="sm:mr-4" @refresh="refresh" />

                    <router-link
                        id="createAccountIcon"
                        title="Add a new Course"
                        to="/createCourse"
                        class="flex flex-row items-center justify-center mb-4 sm:mb-0 sm:w-32 w-full border-2 rounded-lg border-gray-300 h-12 px-12 btn-green-primary-500"
                    >
                        <p class="mr-3 font-semibold">Add</p>
                        <i class="fas fa-calendar-plus" />
                    </router-link>
                </div>
            </div>

            <course-type-filter v-model:selected-type="selectedType" class="w-full my-4" />

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
