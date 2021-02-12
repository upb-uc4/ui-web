<template>
    <div>
        <loading-component v-if="isLoading" title="Loading Courses..." />
        <div v-for="course in shownCourses" v-else :key="course.courseId" class="mt-6">
            <student-course :admitted="isAdmittedToCourse(course)" :course="course" :lecturer="findLecturer(course)" />
            <hr class="my-6 dark:border-normalgray-700" />
        </div>
    </div>
</template>

<script lang="ts">
    import { useStore } from "@/use/store/store";
    import StudentCourse from "@/components/course/list/student/StudentCourse.vue";
    import CourseManagement from "@/api/CourseManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import Course from "@/api/api_models/course_management/Course";
    import APIResponse from "@/api/helpers/models/APIResponse";
    import { computed, ref, onBeforeMount } from "vue";
    import UserManagement from "@/api/UserManagement";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import User_List from "@/api/api_models/user_management/User_List";
    import AdmissionManagement from "@/api/AdmissionManagement";
    import MatriculationManagement from "@/api/MatriculationManagement";

    export default {
        name: "CourseList",
        components: {
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
            onlyAdmittedCourses: {
                type: Boolean,
                default: false,
            },
        },
        emits: ["updated"],
        setup(props: any, { emit }: any) {
            let isLoading = ref(false);
            let lecturers = ref([] as Lecturer[]);
            let courses = ref([] as Course[]);
            let admittedCourses = ref([] as any[]);
            let username = ref("");

            onBeforeMount(async () => {
                isLoading.value = true;
                const promises = [];
                promises.push(getUsername(), getCourses());
                await Promise.all(promises);
                await getAdmittedCourses();
                isLoading.value = false;
            });

            async function getUsername() {
                const store = useStore();
                username.value = (await store.getters.user).username;
            }
            async function getCourses() {
                const genericResponseHandler = new GenericResponseHandler("courses");
                const courseManagement: CourseManagement = new CourseManagement();
                const userManagement: UserManagement = new UserManagement();
                if (props.onlyAdmittedCourses) {
                    let tmpCourses = [] as Course[];
                    for (const m of admittedCourses.value) {
                        let response: APIResponse<Course>;
                        response = await courseManagement.getCourse(m.courseId);
                        let result = genericResponseHandler.handleResponse(response);
                        if (result) tmpCourses.unshift(result);
                    }
                    courses.value = tmpCourses;
                } else {
                    let response: APIResponse<Course[]>;
                    response = await courseManagement.getCourses(undefined, undefined, undefined, await getOwnExamRegNames());
                    courses.value = genericResponseHandler.handleResponse(response);
                }
                const lecturerIds = new Set(courses.value.map((course) => course.lecturerId));
                const resp = await userManagement.getUsers(undefined, Array.from(lecturerIds));
                lecturers.value = (genericResponseHandler.handleResponse(resp) as User_List).lecturers;
            }

            async function getOwnExamRegNames(): Promise<string[]> {
                const matriculation_management = new MatriculationManagement();
                const handler = new GenericResponseHandler("examination regulations");
                const response = await matriculation_management.getOwnMatriculationHistory();
                const result = handler.handleResponse(response);
                let returnValue = [] as string[];
                result.matriculationStatus.forEach((matriculation) => {
                    returnValue.push(matriculation.fieldOfStudy);
                });
                return returnValue;
            }

            async function getAdmittedCourses() {
                const admissionManagement = new AdmissionManagement();
                const handler = new GenericResponseHandler("admitted courses");
                const resp = await admissionManagement.getCourseAdmissions(username.value);
                const result = handler.handleResponse(resp);
                if (Object.keys(result).length > 0) {
                    admittedCourses.value = result;
                }
            }

            function findLecturer(course: Course) {
                return lecturers.value.filter((lecturer) => lecturer.username === course.lecturerId)[0];
            }

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
                emit("updated", filteredCourses.length);
                return filteredCourses;
            });

            function isAdmittedToCourse(course: Course) {
                return admittedCourses.value.some((admittedCourse: Course) => admittedCourse.courseId === course.courseId);
            }

            return {
                isLoading,
                shownCourses,
                findLecturer,
                username,
                isAdmittedToCourse,
            };
        },
    };
</script>
