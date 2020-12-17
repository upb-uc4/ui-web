<template>
    <div class="max-w-screen-lg mx-auto w-full">
        <div class="text-2xl text-center font-medium text-gray-800 mb-4">{{ title }}</div>
        <div>
            <div class="flex flex-col-reverse md:flex-row items-center justify-between md:space-x-2 space-y-2 space-y-reverse md:space-y-0">
                <div class="w-full md:flex items-center md:space-x-2 space-y-2 md:space-y-0">
                    <div class="md:max-w-md w-full">
                        <seach-bar v-model:message="message" placeholder="Find a course..." @refresh="refresh" />
                    </div>
                    <div class="flex space-x-2 w-56">
                        <filter-select v-model:selection="selectedType" label="Type" :elements="types" />
                    </div>
                </div>
                <router-link
                    v-if="!isCourseCatalogue"
                    id="addCourse"
                    to="/createCourse"
                    title="Add a new Course"
                    class="btn-add-tmp md:w-24 w-full flex items-center justify-center space-x-2"
                >
                    <i class="fas fa-calendar-plus" />
                    <span class="font-semibold">New</span>
                </router-link>
            </div>
        </div>
        <hr class="my-4" />
        <div></div>
        <div>
            <course-list :key="refreshKey" :show-all-courses="showAllCourses" :selected-type="selectedType" :filter="message" />
        </div>
    </div>
</template>

<script lang="ts">
    import CourseList from "@/components/course/list/common/CourseList.vue";
    import SeachBar from "@/components/common/SearchBar.vue";
    import { ref, watch } from "vue";
    import { CourseType } from "@/entities/CourseType";
    import Select from "@/components/common/Select.vue";
    import { CourseTypeFilter } from "@/entities/CourseTypeFilter";

    export default {
        name: "LecturerCourseList",
        components: {
            CourseList,
            SeachBar,
            FilterSelect: Select,
        },
        props: {
            showAllCourses: {
                type: Boolean,
                required: true,
            },
            isCourseCatalogue: {
                type: Boolean,
                default: false,
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

            let types = Object.values(CourseTypeFilter);
            let selectedType = ref(types[0]);

            function refresh() {
                refreshKey.value = !refreshKey.value;
            }

            return {
                types,
                refreshKey,
                refresh,
                message,
                selectedType,
                title,
            };
        },
    };
</script>
