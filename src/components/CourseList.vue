<template>
    <div>
        <div v-for="course in courses" :key="course.courseId">
            <lecturer-course v-if="isLecturer" :course="course" class="mb-8" />
            <student-course v-if="isStudent" :course="course" class="mb-8" />
        </div>
    </div>
</template>

<script lang="ts">
    import { store } from "@/store/store";
    import { Role } from "@/entities/Role";
    import LecturerCourse from "./LecturerCourse.vue";
    import StudentCourse from "./StudentCourse.vue";
    import CourseManagement from "@/api/CourseManagement";
    import GenericResponseHandler from "@/use/GenericResponseHandler";

    export default {
        name: "CourseList",
        components: {
            LecturerCourse,
            StudentCourse,
        },
        async setup() {
            let role = store.state.myRole;
            let roles = Object.values(Role).filter((e) => e != Role.NONE);
            let isLecturer: boolean = role == Role.LECTURER;
            let isStudent: boolean = role == Role.STUDENT;
            let courseManagement: CourseManagement = new CourseManagement();
            let myId = store.state.myId;

            const genericResponseHandler = new GenericResponseHandler();
            const response = await courseManagement.getCourses();
            let courses = genericResponseHandler.handleReponse(response);

            if (isLecturer) {
                courses = courses.filter((course) => course.lecturerId == myId);
            }

            return {
                role,
                roles,
                myId,
                courses,
                isLecturer,
                isStudent,
            };
        },
    };
</script>
