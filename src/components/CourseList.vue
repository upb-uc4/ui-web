<template>
    <div class="w-full max-w-4xl">
        <course-list-filter :courses="courses" @filter="filter"></course-list-filter>
        <div v-for="course in filteredCourses" :key="course.name">
            <course :course="course" class="mb-8"></course>
        </div>
    </div>
</template>

<script lang="ts">
    import Course from "./Course.vue";
    import CourseListFilter from "./CourseListFilter.vue"
    export default {
        name: "CourseList",
        components: {
            Course,
            CourseListFilter
        },
        props: [
            'courses'
        ],
        data: function() {
            return {
                filteredCourses: {...this.courses}
            }
        }, 
        methods: {
            filter: function(value : object[]) {
                this.filteredCourses = value
                console.log(this.filteredCourses)
            }
        }
    }
</script>