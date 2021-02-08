<template>
    <div>
        <loading-component v-if="isLoading" title="Loading Courses..." />
        <div v-for="exam in shownExams" v-else :key="exam.examId" class="mt-6">
            <exam-row :is-student="isStudent" :exam-admissions="examAdmissions" :exam="exam" :course="getCourse(exam.courseId)" />
            <hr class="my-6 dark:border-normalgray-700" />
        </div>
    </div>
</template>

<script lang="ts">
    import { useStore } from "@/use/store/store";
    import { Role } from "@/entities/Role";
    import ExamRow from "./ExamRow.vue";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { computed, ref, onBeforeMount, watch } from "vue";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";
    import Lecturer from "@/api/api_models/user_management/Lecturer";

    import Exam from "../mockExamInterface";
    import CourseManagement from "@/api/CourseManagement";
    import Course from "@/api/api_models/course_management/Course";

    export default {
        name: "CourseList",
        components: {
            ExamRow,
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
        emits: ["updated"],
        setup(props: any, { emit }: any) {
            // TODO REMOVE MOCK DATA
            const mockedExams = [
                {
                    examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00",
                    courseId: "-1",
                    lecturerEnrollmentId: "0123456",
                    moduleId: "M.1275.1111",
                    type: "Written Exam",
                    date: "2021-02-12T10:00:00",
                    ects: 6,
                    admittableUntil: "2021-05-12T23:59:59",
                    droppableUntil: "2021-06-05T23:59:59",
                },
                {
                    examId: "ExampleGroup3:M.2:Written Exam:2021-02-26T11:15:00",
                    courseId: "-2",
                    lecturerEnrollmentId: "0123456",
                    moduleId: "M.1275.0000",
                    type: "Oral Exam",
                    date: "2021-02-26T11:15:00",
                    ects: 10,
                    admittableUntil: "2021-01-26T23:59:59",
                    droppableUntil: "2021-06-19T23:59:59",
                },
            ];
            const mockedCourses = [
                {
                    courseDescription: "This is a course description.",
                    courseId: "-2",
                    courseLanguage: "English",
                    courseName: "Algebra 1",
                    courseType: "Lecture",
                    currentParticipants: 5,
                    ects: 6,
                    startDate: "1999-01-01",
                    endDate: "2000-01-01",
                    lecturerId: "lecturer",
                    maxParticipants: 10,
                    moduleIds: ["M.1275.1111"],
                } as Course,
                {
                    courseDescription: "This is another course description.",
                    courseId: "-1",
                    courseLanguage: "German",
                    courseName: "VueJS Programming 1",
                    courseType: "Lecture",
                    currentParticipants: 5,
                    ects: 6,
                    startDate: "1999-01-01",
                    endDate: "2000-01-01",
                    lecturerId: "lecturer",
                    maxParticipants: 10,
                    moduleIds: ["M.1275.0000"],
                } as Course,
            ] as Course[];

            const mockedExamAdmissions = [
                {
                    admissionId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6:AnExampleExamId",
                    enrollmentId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6",
                    timestamp: "2020-12-01",
                    type: "Exam",
                    examId: "ExampleGroup3:M.2:Written Exam:2021-02-26T11:15:00",
                },
            ];

            let isLoading = ref(false);
            const roles = Object.values(Role).filter((e) => e != Role.NONE);
            const courses = ref([] as Course[]);
            let role = ref("");
            let isAdmin = ref(false);
            let exams = ref([] as Exam[]);
            const examAdmissions = ref([] as any[]);
            let username = ref("");

            onBeforeMount(async () => {
                isLoading.value = true;
                await getExams();
                await getRole();
                if (isStudent.value) {
                    await getExamAdmissions();
                }
                isLoading.value = false;
            });

            const isStudent = computed(() => {
                return role.value === Role.STUDENT;
            });

            async function getRole() {
                const store = useStore();
                role.value = await store.getters.role;
            }
            async function getExams() {
                const genericResponseHandler = new GenericResponseHandler("exams");
                // TODO GET EXAMS VIA API
                exams.value = mockedExams;

                //TODO INCLUDE WHEN HAVING THE EXAMS API
                // const courseIds = new Set(exams.value.map((exam) => exam.courseId));
                // const course_management = new CourseManagement();
                // const handler = new GenericResponseHandler("courses");
                // const response = await course_management.getCourses(undefined, undefined, [...courseIds]);
                // courses.value = handler.handleResponse(response);
                courses.value = mockedCourses;
            }

            async function getExamAdmissions() {
                //TODO API
                examAdmissions.value = mockedExamAdmissions;
            }

            let shownExams = computed(() => {
                let filteredExams = props.selectedType == "All" ? exams.value : exams.value.filter((e) => e.type == props.selectedType);
                if (props.filter != "") {
                    let filter = props.filter.toLowerCase();
                    filteredExams = filteredExams.filter(
                        (e) =>
                            e.examId.toLowerCase().replace(/\s/g, "").includes(filter.replace(/\s/g, "")) ||
                            e.courseId.toLowerCase().replace(/\s/g, "").includes(filter.replace(/\s/g, "")) ||
                            e.moduleId.toLowerCase().replace(/\s/g, "").includes(filter.replace(/\s/g, "")) ||
                            courses.value.some(
                                (course) =>
                                    course.courseId == e.courseId &&
                                    course.courseName.toLowerCase().replace(/\s/g, "").includes(filter.replace(/\s/g, ""))
                            )
                    );
                }
                emit("updated", filteredExams.length);
                return filteredExams;
            });

            function getCourse(courseId: string) {
                return courses.value.filter((course) => course.courseId == courseId)[0];
            }

            return {
                isLoading,
                role,
                roles,
                shownExams,
                isAdmin,
                username,
                getCourse,
                examAdmissions,
                isStudent,
            };
        },
    };
</script>
