<template>
    <base-view extra-classes="max-w-screen-lg mx-auto">
        <div class="text-2xl text-center font-medium text-gray-800 dark:text-gray-300 mb-4">{{ title }}</div>
        <div>
            <div class="flex flex-col-reverse md:flex-row items-center justify-between md:space-x-2 space-y-2 space-y-reverse md:space-y-0">
                <div class="w-full md:flex items-center md:space-x-2 space-y-2 md:space-y-0">
                    <div class="md:max-w-md w-full">
                        <search-bar v-model:message="message" placeholder="Find a course..." @refresh="refresh" />
                    </div>
                    <div class="flex space-x-2 w-56">
                        <filter-select id="studentCourseTypeFilter" v-model:selection="selectedType" label="Type" :elements="types" />
                    </div>
                </div>
            </div>
        </div>
        <hr class="my-4 dark:border-normalgray-700" />
        <div v-show="isFiltering()" class="text-gray-800 dark:text-gray-300 text-sm">
            <div class="flex justify-between">
                <div>
                    <div v-if="isFilteringType()">
                        <span class="font-semibold">{{ matchingCoursesCount }}</span> results for
                        <span class="font-semibold">{{ selectedType.toLowerCase() }}s</span>
                        <span v-if="isFilteringBySearch()">
                            matching
                            <span class="font-semibold">{{ message }}.</span>
                        </span>
                        <span v-else>.</span>
                    </div>
                    <div v-else>
                        <span class="font-semibold">{{ matchingCoursesCount }}</span> results matching
                        <span class="font-semibold">{{ message }}.</span>
                    </div>
                </div>
                <div class="btn-tertiary" @click="clearFilter()">Clear filter</div>
            </div>
            <hr class="mt-4 mb-8 dark:border-normalgray-700" />
        </div>
        <div>
            <course-list
                :key="refreshKey"
                :only-admitted-courses="isMyCoursesPage"
                :selected-type="selectedType"
                :filter="message"
                @updated="matchingCoursesCount = $event"
            />
        </div>
    </base-view>
</template>

<script lang="ts">
    import CourseList from "@/components/course/list/student/CourseList.vue";
    import SearchBar from "@/components/common/SearchBar.vue";
    import { onBeforeMount, ref, watch } from "vue";
    import Select from "@/components/common/Select.vue";
    import BaseView from "@/views/common/BaseView.vue";
    import { useStore } from "@/use/store/store";

    export default {
        name: "StudentCourseList",
        components: {
            BaseView,
            CourseList,
            SearchBar,
            FilterSelect: Select,
        },
        props: {
            isMyCoursesPage: {
                type: Boolean,
                default: false,
            },
        },
        setup(props: any) {
            const matchingCoursesCount = ref(0);
            let title = ref(props.isMyCoursesPage ? "My Courses" : "Available Courses");
            let message = ref("");
            let refreshKey = ref(false);

            const defaultType = "All";
            const selectedType = ref(defaultType);
            const types = ref([] as string[]);

            onBeforeMount(async () => {
                const store = useStore();
                await store.getters.configuration.then((config) => {
                    types.value = [...config.courseTypes];
                    types.value.unshift("All");
                });
            });

            watch(
                () => props.isMyCoursesPage,
                () => {
                    title.value = props.isMyCoursesPage ? "My Courses" : "Available Courses";
                    refresh();
                }
            );

            function refresh() {
                refreshKey.value = !refreshKey.value;
            }

            function isFilteringBySearch() {
                return message.value !== "";
            }

            function isFilteringType() {
                return selectedType.value !== defaultType;
            }

            function isFiltering() {
                return isFilteringBySearch() || isFilteringType();
            }

            function clearFilter() {
                message.value = "";
                selectedType.value = defaultType;
            }

            return {
                matchingCoursesCount,
                types,
                refreshKey,
                refresh,
                message,
                selectedType,
                isFilteringBySearch,
                isFilteringType,
                isFiltering,
                clearFilter,
                title,
            };
        },
    };
</script>
