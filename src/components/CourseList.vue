<template>
    <div class="w-full max-w-4xl">
        <div v-for="course in courses" :key="course.name">
            <course :course="course" class="mb-8"></course>
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