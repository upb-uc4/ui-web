<template>
    <div class="w-full max-w-4xl">
        <div class="flex">
            <div class="w-full pt-2 mb-8">
                <seach-bar v-model:message="message" @refresh="refresh" />
            </div>
        </div>
        <suspense>
            <template #default>
                <courseList :key="refreshKey" />
            </template>
            <template #fallback>
                <p class="text-center text-lg pt-20">
                    Loading Courses...
                </p>
            </template>
        </suspense>
    </div>
</template>

<script lang="ts">
    import CourseList from "./CourseList.vue";
    import SeachBar from "./SearchBar.vue";
    import { ref } from "vue";

    export default {
        name: "StudentCourseList",
        components: {
            CourseList,
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
