<template>
    <div>
        <div class="mt-32 text-4xl text-center font-semibold text-gray-900">My Courses</div>
        <div class="mt-8 flex justify-center">
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
                name: "Vue.js 101",
                type: "Seminar",
                lecturer: "Prof. Dr. Bienlein",
                description: "This is a generic course description which can be quite long. " +
                    "It may consists of several paragraphs and perhaps should be shortened." +
                    "Could also include a 'click for more'.",
                participants: 5,
                maxParticipants: 16,
                weekday: 'Tuesdays',
                from: '14:00',
                to: '16:00',
            },
            tailwind: {
                name: "Tailwindcss 101",
                type: "Lecture",
                lecturer: "Donald Duck",
                description: "This is a generic course description which can be quite long. " +
                    "It may consists of several paragraphs and perhaps should be shortened." +
                    "Could also include a 'click for more'.",
                participants: 74,
                maxParticipants: 105,
                weekday: 'Mondays',
                from: '08:00',
                to: '10:30',
            },
        },
    })
}
</script>
