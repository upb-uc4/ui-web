<template>
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
        <suspense>
            <template #default>
                <course-list :key="refreshKey" :selected-type="selectedType" :filter="message" />
            </template>
            <template #fallback>
                <loading-component />
            </template>
        </suspense>

        <div class="flex justify-center mt-16">
            <router-link to="/createCourse">
                <button id="addCourse" class="px-4 btn btn-green-primary-500">New Course</button>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import CourseList from "./CourseList.vue";
    import LoadingComponent from "./loading/Spinner.vue";
    import SeachBar from "./SearchBar.vue";
    import { ref } from "vue";
    import CourseTypeFilter from "./CourseTypeFilter.vue";
    import { CourseType } from "@/entities/CourseType";

    export default {
        name: "LecturerCourseList",
        components: {
            CourseList,
            LoadingComponent,
            SeachBar,
            CourseTypeFilter,
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
