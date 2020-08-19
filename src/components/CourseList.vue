<template>
    <div>
        <div v-if="busy">
            <loading-component />
        </div>
        <suspense v-else>
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
    import { computed, ref, onBeforeMount } from "vue";
    import { CourseType } from "@/entities/CourseType";
    import UserManagement from "@/api/UserManagement";
    import LoadingComponent from "@/components/loading/Spinner.vue";
    import Lecturer from "@/api/api_models/user_management/Lecturer";

    export default {
        name: "CourseList",
        components: {
            LecturerCourse,
            StudentCourse,
            LoadingComponent,
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

        setup(props: any) {
            let busy = ref(false);
            const roles = Object.values(Role).filter((e) => e != Role.NONE);
            let lecturers = ref([] as Lecturer[]);
            let role = ref("");
            let isLecturer = ref(false);
            let isStudent = ref(false);
            let courses = ref([] as Course[]);

            onBeforeMount(() => {
                getCourses();
            });

            async function getCourses() {
                busy.value = true;
                const store = useStore();
                role.value = await store.getters.role;
                isLecturer.value = role.value == Role.LECTURER;
                isStudent.value = role.value == Role.STUDENT;
                const genericResponseHandler = new GenericResponseHandler();
                let response: APIResponse<Course[]>;
                const courseManagement: CourseManagement = new CourseManagement();
                const userManagement: UserManagement = new UserManagement();
                if (isLecturer.value) {
                    let username = (await store.getters.loginData).username;
                    response = await courseManagement.getCourses(undefined, username);
                    courses.value = genericResponseHandler.handleReponse(response);
                } else if (isStudent.value) {
                    response = await courseManagement.getCourses();
                    courses.value = genericResponseHandler.handleReponse(response);
                }
                const lecturerIds = new Set(courses.value.map((course) => course.lecturerId));
                const resp = await userManagement.getLecturers(...lecturerIds);
                lecturers.value = genericResponseHandler.handleReponse(resp);
                busy.value = false;
            }

            function findLecturer(course: Course) {
                return lecturers.value.filter((lecturer) => lecturer.username === course.lecturerId)[0];
            }

            let shownCourses = computed(() => {
                let filteredCourses =
                    props.selectedType == ("All" as CourseType)
                        ? courses.value
                        : courses.value.filter((e) => e.courseType == props.selectedType);
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
                busy,
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
