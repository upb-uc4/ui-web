<template>
    <div class="w-full max-w-4xl">
        <div class="flex">
            <div class="w-full">
                <div class="pt-2 mb-8 relative mx-auto text-gray-600">
                    <i class="fas fa-search absolute left-0 top-0 mt-6 ml-4"></i>
                    <input class="w-full border-2 border-gray-300 bg-white h-12 px-5 pl-12 rounded-lg focus:outline-none"
                           type="search" placeholder="Filter"
                           v-model="message">
                </div>
            </div>
        </div>
        <suspense>
            <template #default>
                <courseList></courseList>
            </template>
            <template #fallback>
                <p class="text-center text-lg pt-20">
                    Loading Courses...
                </p>
            </template>
        </suspense>

        <div class="flex justify-center mt-16">
            <router-link to="/createCourse">
                <button class="px-4 btn btn-green-primary-500">New Course</button>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import CourseList from "./CourseList.vue"

    export default {
        name: "LecturerCourseList",
        components: {
            CourseList,
        },
        data() {
            return {
                message: "",
            }
        },
    };
</script>