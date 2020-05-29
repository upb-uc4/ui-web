<template>
    <div>
        <div v-for="course in courses" :key="course.name">
            <course :course="course"></course>
        </div>
    </div>
</template>

<script>
    import Course from "./Course";
    export default {
        name: "CourseList",
        components: {
            Course
        },
        props: [
            'courses'
        ],
    }
</script>