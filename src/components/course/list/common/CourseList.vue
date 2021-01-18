<template>
    <div>
        <loading-component v-if="isLoading" title="Loading Courses..." />
        <div v-for="course in shownCourses" v-else :key="course.courseId" class="mt-6">
            <lecturer-course :course="course" :allow-edit="isAdmin || course.lecturerId === username" :lecturer="findLecturer(course)" />
            <hr class="my-6 dark:border-normalgray-700" />
        </div>
    </div>
</template>

<script lang="ts">
    import { useStore } from "@/use/store/store";
    import { Role } from "@/entities/Role";
    import LecturerCourse from "../lecturer/LecturerCourse.vue";
    import CourseManagement from "@/api/CourseManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import Course from "@/api/api_models/course_management/Course";
    import APIResponse from "@/api/helpers/models/APIResponse";
    import { computed, ref, onBeforeMount, watch } from "vue";
    import UserManagement from "@/api/UserManagement";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";
    import Lecturer from "@/api/api_models/user_management/Lecturer";

    export default {
        name: "CourseList",
        components: {
            LecturerCourse,
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
        emits: ["on-updated"],
        setup(props: any, { emit }: any) {
            let isLoading = ref(false);
            const roles = Object.values(Role).filter((e) => e != Role.NONE);
            let lecturers = ref([] as Lecturer[]);
            let role = ref("");
            let isAdmin = ref(false);
            let courses = ref([] as Course[]);
            let username = ref("");

            onBeforeMount(async () => {
                await getCourses();
            });
            async function getCourses() {
                isLoading.value = true;
                const store = useStore();
                role.value = (await store.getters.user).role;
                isAdmin.value = role.value == Role.ADMIN;
                const genericResponseHandler = new GenericResponseHandler("courses");
                let response: APIResponse<Course[]>;
                const courseManagement: CourseManagement = new CourseManagement();
                const userManagement: UserManagement = new UserManagement();
                username.value = (await store.getters.user).username;
                if (props.showAllCourses) {
                    response = await courseManagement.getCourses();
                } else {
                    response = await courseManagement.getCourses(undefined, username.value);
                }
                courses.value = genericResponseHandler.handleResponse(response);
                const lecturerIds = new Set(courses.value.map((course) => course.lecturerId));
                const resp = await userManagement.getUsers(Role.LECTURER, [...lecturerIds]);
                lecturers.value = genericResponseHandler.handleResponse(resp) as Lecturer[];
                isLoading.value = false;
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
                    props.selectedType == "All" ? courses.value : courses.value.filter((e) => e.courseType == props.selectedType);
                if (props.filter != "") {
                    let filter = props.filter.toLowerCase();
                    filteredCourses = filteredCourses.filter(
                        (e) =>
                            e.courseName.toLowerCase().replace(/\s/g, "").includes(filter.replace(/\s/g, "")) ||
                            e.courseDescription.toLowerCase().replace(/\s/g, "").includes(filter.replace(/\s/g, "")) ||
                            e.courseId.toLowerCase().includes(filter) ||
                            e.lecturerId.toLowerCase().includes(filter)
                    );
                }
                emit("on-updated", filteredCourses.length);
                return filteredCourses;
            });

            return {
                isLoading,
                role,
                roles,
                shownCourses,
                isAdmin,
                findLecturer,
                username,
            };
        },
    };
</script>
