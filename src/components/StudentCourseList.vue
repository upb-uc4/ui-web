<template>
    <div class="w-full max-w-4xl">
        <div class="flex">
            <div class="w-full">
                <div class="pt-2 mb-8 relative mx-auto text-gray-600 flex">
                    <i class="fas fa-search absolute left-0 top-0 mt-6 ml-4"></i>
                    <input
                        v-model="message"
                        class="w-full border-2 border-gray-300 bg-white h-12 px-12 rounded-lg focus:outline-none"
                        type="search"
                        placeholder="Filter"
                    />
                    <button class="-ml-8 my-1 focus:outline-none" title="Refresh" @click="refresh">
                        <i class="inline fas fa-redo-alt text-gray-600 hover:text-gray-700" />
                    </button>
                </div>
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
    import { ref } from "vue";

    export default {
        name: "StudentCourseList",
        components: {
            CourseList,
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
