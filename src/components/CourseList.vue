<template>
    <div>
        <div v-for="course in courses" :key="course.courseId">
            <lecturer-course v-if="isLecturer" :course="course" class="mb-8" />
            <student-course v-if="isStudent" :course="course" class="mb-8" />
        </div>
    </div>
</template>

<script lang="ts">
    import { useStore } from "@/store/store";
    import { Role } from "@/entities/Role";
    import LecturerCourse from "./LecturerCourse.vue";
    import StudentCourse from "./StudentCourse.vue";
    import CourseManagement from "@/api/CourseManagement";
    import GenericResponseHandler from "@/use/GenericResponseHandler";
    import Course from "../api/api_models/course_management/Course";
    import APIResponse from "../api/helpers/models/APIResponse";

    export default {
        name: "CourseList",
        components: {
            LecturerCourse,
            StudentCourse,
        },
        async setup() {
            const store = useStore();
            const role = await store.getters.role;
            const roles = Object.values(Role).filter((e) => e != Role.NONE);
            const isLecturer: boolean = role == Role.LECTURER;
            const isStudent: boolean = role == Role.STUDENT;
            const courseManagement: CourseManagement = new CourseManagement();
            const genericResponseHandler = new GenericResponseHandler();
            let courses: Course[] = [];
            let response: APIResponse<Course[]>;

            if (isLecturer) {
                let username = (await store.getters.loginData).username;
                response = await courseManagement.getCourses(undefined, username);
                courses = genericResponseHandler.handleReponse(response);
            } else if (isStudent) {
                response = await courseManagement.getCourses();
                courses = genericResponseHandler.handleReponse(response);
            }

            return {
                role,
                roles,
                courses,
                isLecturer,
                isStudent,
            };
        },
    };
</script>
