<template>
    <div>
        <div v-if="busy">
            <loading-component />
        </div>
        <suspense v-else>
            <template #default>
                <div v-for="course in shownCourses" :key="course.courseId">
                    <lecturer-course
                        v-if="isLecturer || isAdmin"
                        :course="course"
                        :allow-edit="isAdmin || course.lecturerId == username"
                        :lecturer="findLecturer(course)"
                        class="mb-8"
                    />
                    <student-course v-if="isStudent" :course="course" :lecturer="findLecturer(course)" class="mb-8" />
                </div>
            </template>
            <template #fallback />
        </suspense>
    </div>
</template>

<script lang="ts">
    import { useStore } from "@/use/store/store";
    import { Role } from "@/entities/Role";
    import LecturerCourse from "../lecturer/LecturerCourse.vue";
    import StudentCourse from "../student/StudentCourse.vue";
    import CourseManagement from "@/api/CourseManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import Course from "@/api/api_models/course_management/Course";
    import APIResponse from "@/api/helpers/models/APIResponse";
    import { computed, ref, onBeforeMount, watch } from "vue";
    import { CourseType } from "@/entities/CourseType";
    import UserManagement from "@/api/UserManagement";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";
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
            showAllCourses: {
                type: Boolean,
                required: true,
            },
        },

        setup(props: any) {
            let busy = ref(false);
            const roles = Object.values(Role).filter((e) => e != Role.NONE);
            let lecturers = ref([] as Lecturer[]);
            let role = ref("");
            let isLecturer = ref(false);
            let isAdmin = ref(false);
            let isStudent = ref(false);
            let courses = ref([] as Course[]);
            let username = ref("");

            onBeforeMount(async () => {
                await getCourses();
            });
            async function getCourses() {
                busy.value = true;
                const store = useStore();
                role.value = (await store.getters.user).role;
                isLecturer.value = role.value == Role.LECTURER;
                isAdmin.value = role.value == Role.ADMIN;
                isStudent.value = role.value == Role.STUDENT;
                const genericResponseHandler = new GenericResponseHandler();
                let response: APIResponse<Course[]>;
                const courseManagement: CourseManagement = new CourseManagement();
                const userManagement: UserManagement = new UserManagement();
                if (isLecturer.value || isAdmin.value) {
                    username.value = (await store.getters.user).username;
                    if (props.showAllCourses) {
                        response = await courseManagement.getCourses();
                    } else {
                        response = await courseManagement.getCourses(undefined, username.value);
                    }
                    courses.value = genericResponseHandler.handleResponse(response);
                } else if (isStudent.value) {
                    response = await courseManagement.getCourses();
                    courses.value = genericResponseHandler.handleResponse(response);
                }
                const lecturerIds = new Set(courses.value.map((course) => course.lecturerId));
                const resp = await userManagement.getLecturers(...lecturerIds);
                lecturers.value = genericResponseHandler.handleResponse(resp);
                busy.value = false;
            }

            function findLecturer(course: Course) {
                return lecturers.value.filter((lecturer) => lecturer.username === course.lecturerId)[0];
            }

            watch(
                () => props.showAllCourses,
                () => {
                    getCourses();
                }
            );

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
                isAdmin,
                isStudent,
                findLecturer,
                username,
            };
        },
    };
</script>
