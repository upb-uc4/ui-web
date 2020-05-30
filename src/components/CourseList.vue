<template>
    <div class="w-full max-w-4xl">
        <course-list-filter :courses="courses" @filter="filter"></course-list-filter>
        <div v-for="course in filteredCourses" :key="course.name">
            <course :course="course" class="mb-8"></course>
        </div>
    </div>
</template>

<script>
    import Course from "./Course";
    import CourseListFilter from "./CourseListFilter"
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
            filter: function(value) {
                this.filteredCourses = value
                console.log(this.filteredCourses)
            }
        }
    }
</script>