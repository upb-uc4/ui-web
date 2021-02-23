<template>
    <div>
        <loading-component v-if="isLoading" title="Loading Exams..." />
        <div v-for="exam in shownExams" v-else :key="exam.examId" class="mt-6">
            <exam-row
                :is-student="isStudent"
                :exam-grade="examResults.find((result) => result.examId == exam.examId)?.grade"
                :exam-admissions="examAdmissions"
                :exam="exam"
                :course="getCourse(exam.courseId)"
            />
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
    import Exam from "../mockExamInterface";
    import CourseManagement from "@/api/CourseManagement";
    import Course from "@/api/api_models/course_management/Course";
    import ExamResult, { Grade } from "../MockExamResultInterface";
    import ExamManagement from "@/api/ExamManagement";
    import CertificateManagement from "@/api/CertificateManagement";

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
                    admittableUntil: "2021-02-12T23:59:59",
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
                    droppableUntil: "2021-01-19T23:59:59",
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

            const mockedExamResults = [
                {
                    examId: "ExampleGroup3:M.2:Written Exam:2021-02-26T11:15:00a",
                    enrollmentId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6",
                    grade: Grade.g5_0,
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
            const examResults = ref([] as ExamResult[]);

            onBeforeMount(async () => {
                isLoading.value = true;
                await getUserInfo();
                let promises = [];
                promises.push(getExams());
                if (isStudent.value) {
                    promises.push(getExamAdmissions());
                    promises.push(getExamResults());
                }
                await Promise.all(promises);
                isLoading.value = false;
            });

            const isStudent = computed(() => {
                return role.value === Role.STUDENT;
            });

            async function getExamResults() {
                //TODO API CALL
                examResults.value = mockedExamResults;
            }

            async function getUserInfo() {
                const store = useStore();
                role.value = await store.getters.role;
                username.value = (await store.getters.user).username;
            }
            async function getExams() {
                const enrollmentId = await getOwnEnrollmentId();
                const genericResponseHandler = new GenericResponseHandler("exams");
                const exam_management = new ExamManagement();
                const examResponse = await exam_management.getExams(undefined, undefined, [enrollmentId]);
                exams.value = genericResponseHandler.handleResponse(examResponse);

                const course_management = new CourseManagement();
                const handler = new GenericResponseHandler("courses");
                const courseResponse = await course_management.getCourses(undefined, (await useStore().getters.user).username);
                courses.value = handler.handleResponse(courseResponse);
            }

            async function getOwnEnrollmentId(): Promise<string> {
                const cert_management = new CertificateManagement();
                const handler = new GenericResponseHandler("enrollment-ID");
                return handler.handleResponse(await cert_management.getOwnEnrollmentId())[0].enrollmentId;
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
                examResults,
            };
        },
    };
</script>
