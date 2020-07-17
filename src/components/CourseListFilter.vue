<template>
    <div class="w-full">
        <div class="pt-2 relative mx-auto text-gray-600">
            <i class="fas fa-search absolute left-0 top-0 mt-6 ml-4"></i>
            <input
                v-model="message"
                class="w-full border-2 border-gray-300 bg-white h-12 px-5 pl-12 rounded-lg focus:outline-none"
                type="search"
                placeholder="Filter"
            />
        </div>
        <p hidden>{{ filteredCourses }}</p>
    </div>

    <!--
    <div class="w-full max-w-4xl flex">
        <div class="container w-full">
            <div class="container w-full flex"
            v-bind:class="{'mb-6 shadow-xl rounded-lg':message === '', 'shadow-none rounded-t-lg':message != ''}" > 
                <input class="flex-auto h-8 text-xl  pl-6 outline-none" 
                placeholder="Filter by name.." v-model="message">
                <i class="fas fa-search flex-right pt-2 pr-2 bg-white text-gray-600"></i>
            </div>

            <div v-bind:class="{'hidden':message === ''}" class="bg-white mb-6 w-full pt-2 rounded-b-lg border-t-2">
                <div v-for="searchElement in searchElements" :key="searchElement" class="container flex pl-6 pr-2 pb-1 hover:bg-blue-200 cursor-pointer" @click="addFilter(searchElement)">
                    <div class="flex-auto">{{searchElement.value}}</div>
                    <div class="flex-right text-gray-600 w-1/5">as {{searchElement.key}}</div>
                </div>
            </div>
            <p hidden>{{ filteredCourses }}</p>
        </div>
        <div class="w-2/6 flex-right flex flex-wrap">
            <div v-for="filter in filters" :key="filter.value">
                <div class="rounded-lg mx-4 mb-2 px-2 py-1 flex"
                v-bind:class="{ 'bg-red-500':filter.key==='Studiengang',
                        'bg-green-500':filter.key=='Modul',
                        'bg-blue-500':filter.key=='Language'
                }">
                    <p class="flex-auto text-sm">{{filter.value}}</p>
                    <i class="fas fa-trash flex-right ml-4 pt-1 text-red-200 cursor-pointer" @click="removeFilter(filter)"></i>
                </div>
            </div>
        </div>

    </div>
    -->
</template>

<script lang="ts">
    export default {
        name: "CourseListFilter",
        components: {},
        props: ["courses"],
        data: function (): { message: string; searchElements: { key: string; value: string }[]; filters: object[] } {
            return {
                message: "",
                searchElements: [
                    { value: "Informatik", key: "Studiengang" },
                    { value: "Datenstrukturen und Algorithmen", key: "Modul" },
                    { value: "German", key: "Language" },
                    { value: "English", key: "Language" },
                ],
                filters: [],
            };
        },
        computed: {
            // filtered courses
            filteredCourses: function (): object[] {
                if (this.message == "") {
                    this.$emit("filter", this.courses);
                    return this.courses;
                }
                const filteredCourses = this.courses.filter((course: { courseName: string }) =>
                    course.courseName.toLowerCase().includes(this.message.toLowerCase())
                );

                this.$emit("filter", filteredCourses);
                return filteredCourses;
            },
        },
        methods: {
            addFilter: function (searchElement: { key: string; value: string }) {
                if (!this.filters.includes(searchElement)) {
                    this.filters.push(searchElement);
                    this.message = "";
                }
            },
            removeFilter: function (filter: { key: string; value: string }) {
                if (this.filters.includes(filter)) {
                    this.filters = this.filters.filter((obj) => obj != filter);
                }
            },
        },
    };
</script>
