<template>
    <div>
        <suspense>
            <template #default>
                <div v-for="course in shownCourses" :key="course.courseId">
                    <lecturer-course v-if="isLecturer" :course="course" :lecturer="findLecturer(course)" class="mb-8" />
                    <student-course v-if="isStudent" :course="course" :lecturer="findLecturer(course)" class="mb-8" />
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
    import UserManagement from "@/api/UserManagement";

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
            const userManagement: UserManagement = new UserManagement();

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

            const lecturerIds = new Set(courses.map((course) => course.lecturerId));
            const resp = await userManagement.getLecturers(...lecturerIds);
            const lecturers = genericResponseHandler.handleReponse(resp);

            function findLecturer(course: Course) {
                return lecturers.filter((lecturer) => lecturer.username === course.lecturerId)[0];
            }

            let shownCourses = computed(() => {
                let filteredCourses =
                    props.selectedType == ("All" as CourseType) ? courses : courses.filter((e) => e.courseType == props.selectedType);
                if (props.filter != "") {
                    let filter = props.filter.toLowerCase();
                    filteredCourses = filteredCourses.filter(
                        (e) =>
                            e.courseName.toLowerCase().includes(filter) ||
                            e.courseDescription.toLowerCase().includes(filter) ||
                            e.courseId.toLowerCase().includes(filter) ||
                            e.lecturerId.toLowerCase().includes(filter)
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
                findLecturer,
            };
        },
    };
</script>
