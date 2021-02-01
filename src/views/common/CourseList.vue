<template>
    <base-view extra-classes="max-w-screen-lg mx-auto">
        <div class="text-2xl text-center font-medium text-gray-800 dark:text-gray-300 mb-4">{{ title }}</div>
        <div>
            <div class="flex flex-col-reverse md:flex-row items-center justify-between md:space-x-2 space-y-2 space-y-reverse md:space-y-0">
                <div class="w-full md:flex items-center md:space-x-2 space-y-2 md:space-y-0">
                    <div class="md:max-w-md w-full">
                        <seach-bar v-model:message="message" placeholder="Find a course..." @refresh="refresh" />
                    </div>
                    <div class="flex space-x-2 w-56">
                        <filter-select :id="'selectFilterCourseType'" v-model:selection="selectedType" label="Type" :elements="types" />
                    </div>
                </div>
                <div v-if="!isCourseCatalogue" class="w-full flex justify-end">
                    <router-link
                        id="addCourse"
                        to="/createCourse"
                        title="Add a new Course"
                        class="btn-add md:w-24 w-full flex items-center justify-center space-x-2"
                    >
                        <i class="fas fa-calendar-plus" />
                        <span class="font-semibold">New</span>
                    </router-link>
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
                :show-all-courses="showAllCourses"
                :selected-type="selectedType"
                :filter="message"
                @updated="matchingCoursesCount = $event"
            />
        </div>
    </base-view>
</template>

<script lang="ts">
    import CourseList from "@/components/course/list/common/CourseList.vue";
    import SeachBar from "@/components/common/SearchBar.vue";
    import { onBeforeMount, ref, watch } from "vue";
    import Select from "@/components/common/Select.vue";
    import BaseView from "@/views/common/BaseView.vue";
    import { useStore } from "@/use/store/store";
    import { useToast } from "@/toast";

    export default {
        name: "CommonCourseList",
        components: {
            BaseView,
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
            const matchingCoursesCount = ref(0);
            let message = ref("");
            let refreshKey = ref(false);
            let title = ref(props.showAllCourses ? "All Courses" : "My Courses");
            const types = ref([] as string[]);
            const defaultType = "All";
            let selectedType = ref(defaultType);

            onBeforeMount(async () => {
                const store = useStore();
                await store.getters.configuration
                    .then((config) => {
                        types.value = [...config.courseTypes];
                        types.value.unshift("All");
                    })
                    .catch((reason) => {
                        const toast = useToast();

                        toast.error(reason);
                    });
            });

            watch(
                () => props.showAllCourses,
                () => {
                    title.value = props.showAllCourses ? "All Courses" : "My Courses";
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
