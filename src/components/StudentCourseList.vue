<template>
    <div class="w-full max-w-4xl">
        <div class="flex flex-col">
            <div class="w-full pt-2 mb-8">
                <seach-bar v-model:message="message" @refresh="refresh" />
            </div>
            <course-type-filter v-model:selected-type="selectedType" />
        </div>
        <suspense>
            <template #default>
                <courseList :key="refreshKey" :selected-type="selectedType" />
            </template>
            <template #fallback>
                <loading-component />
            </template>
        </suspense>
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
        name: "StudentCourseList",
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
