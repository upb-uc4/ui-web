<template>
    <div class="w-full max-w-4xl">
        <div class="flex">
            <div class="w-full flex flex-row pt-2 mb-8">
                <seach-bar v-model:message="message" @refresh="refresh" />
                <router-link to="/createCourse" class="w-2/12 ml-4">
                    <button
                        id="createAccountIcon"
                        title="Add a new Course"
                        class="w-full h-full btn-icon-green items-center justify-center flex flex-row"
                    >
                        <p class="mr-3 text-lg font-semibold">Add</p>
                        <i class="inline fas fa-calendar-plus text-2xl" />
                    </button>
                </router-link>
            </div>
        </div>
        <suspense>
            <template #default>
                <course-list :key="refreshKey" />
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

    export default {
        name: "LecturerCourseList",
        components: {
            CourseList,
            LoadingComponent,
            SeachBar,
        },
        setup() {
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
