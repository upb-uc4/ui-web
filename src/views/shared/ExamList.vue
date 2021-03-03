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
                <div v-if="isLecturer" class="w-full flex justify-end">
                    <router-link
                        id="addExam"
                        to="/create-exam"
                        title="Add a new Exam"
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
                        <span class="font-semibold">{{ matchingExamsCount }}</span> results for
                        <span class="font-semibold">{{ selectedType.toLowerCase() }}s</span>
                        <span v-if="isFilteringBySearch()">
                            matching
                            <span class="font-semibold">{{ message }}.</span>
                        </span>
                        <span v-else>.</span>
                    </div>
                    <div v-else>
                        <span class="font-semibold">{{ matchingExamsCount }}</span> results matching
                        <span class="font-semibold">{{ message }}.</span>
                    </div>
                </div>
                <div class="btn-tertiary" @click="clearFilter()">Clear filter</div>
            </div>
            <hr class="mt-4 mb-8 dark:border-normalgray-700" />
        </div>
        <div>
            <exam-list :key="refreshKey" :selected-type="selectedType" :filter="message" @updated="matchingExamsCount = $event" />
        </div>
    </base-view>
</template>

<script lang="ts">
    import ExamList from "@/components/exam/list/ExamList.vue";
    import SearchBar from "@/components/common/SearchBar.vue";
    import { computed, onBeforeMount, ref } from "vue";
    import Select from "@/components/common/Select.vue";
    import { Role } from "@/entities/Role";
    import BaseView from "@/views/common/BaseView.vue";
    import { useStore } from "@/use/store/store";
    import { clone } from "lodash";

    export default {
        name: "StudentCourseList",
        components: {
            BaseView,
            ExamList,
            SearchBar,
            FilterSelect: Select,
        },
        props: {},
        setup(props: any) {
            const matchingExamsCount = ref(0);
            let title = "Exams";
            let message = ref("");
            let refreshKey = ref(false);
            const role = ref("");

            const defaultType = "All";
            const selectedType = ref(defaultType);
            const types = ref([] as string[]);

            onBeforeMount(async () => {
                let promises = [];
                promises.push(getRole(), getConfig());
                await Promise.all(promises);
            });

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

            async function getRole() {
                const store = useStore();
                role.value = await store.getters.role;
            }

            async function getConfig() {
                const store = useStore();
                types.value = clone((await store.getters.configuration).examTypes);
                types.value.unshift(defaultType);
            }

            const isLecturer = computed(() => {
                return role.value === Role.LECTURER;
            });

            return {
                matchingExamsCount,
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
                isLecturer,
            };
        },
    };
</script>
