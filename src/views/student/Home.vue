<template>
    <div>
        <div class="mt-32 text-4xl text-center font-semibold text-gray-900">My Courses</div>
        <div class="mt-16 flex justify-center">
            <course-list :courses="courses"></course-list>
        </div>
    </div>
</template>

<script>
import CourseList from "../../components/CourseList";
export default {
    name: 'Student.Home',
    components: {
        CourseList,
    },
    data: () => ({
        courses: {
            vue: {
                name: "Vue.js 101"
            },
            tailwind: {
                name: "Tailwindcss 101"
            },
        },
    })
}
</script>
