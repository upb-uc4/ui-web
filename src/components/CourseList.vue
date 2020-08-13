<template>
    <div>
        <suspense>
            <template #default>
                <div v-for="course in shownCourses" :key="course.courseId">
                    <lecturer-course v-if="isLecturer" :course="course" class="mb-8" />
                    <student-course v-if="isStudent" :course="course" class="mb-8" />
                </div>
            </template>
            <template #fallback />
        </suspense>
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
    import { computed } from "vue";
    import { CourseType } from "@/entities/CourseType";

    export default {
        name: "CourseList",
        components: {
            LecturerCourse,
            StudentCourse,
        },
        props: {
            selectedType: {
                type: String,
                required: true,
            },
            filter: {
                type: String,
                required: true,
            },
        },

        async setup(props: any) {
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

            let shownCourses = computed(() => {
                let filteredCourses =
                    props.selectedType == ("All" as CourseType) ? courses : courses.filter((e) => e.courseType == props.selectedType);
                if (props.filter != "") {
                    filteredCourses = filteredCourses.filter(
                        (e) =>
                            e.courseName.includes(props.filter) ||
                            e.courseDescription.includes(props.filter) ||
                            e.courseId.includes(props.filter) ||
                            e.lecturerId.includes(props.filter)
                    );
                }
                return filteredCourses;
            });

            return {
                role,
                roles,
                shownCourses,
                isLecturer,
                isStudent,
            };
        },
    };
</script>
