<template>
    <base-view extra-classes="max-w-screen-lg mx-auto">
        <div class="text-2xl text-center font-medium text-gray-800 dark:text-gray-300 mb-4">Exam Results</div>
        <div class="text-lg text-center font-medium text-gray-800 dark:text-gray-400 mb-4">
            Here, you can find the results of all your admitted exams.
        </div>
        <hr class="my-4 dark:border-normalgray-700" />
        <div v-if="isLoading" class="mx-auto">
            <loading-component title="Loading exam performances" />
        </div>
        <div v-else>
            <div v-for="exreg in myExamRegs" :key="exreg.name" class="flex flex-col w-full">
                <div class="flex justify-between w-full">
                    <label class="input-label font-semibold text-lg"> {{ exreg.name }} </label>
                    <div class="w-1/3 hidden sm:flex justify-between text-gray-900 dark:text-gray-300">
                        <label>ECTS</label>
                        <label>Grade</label>
                    </div>
                </div>
                <div v-for="mod in exreg.modules" :key="mod.id" class="flex flex-col my-3 justify-center">
                    <label class="text-gray-600 text-base">{{ `${mod.id}: ${mod.name}` }}</label>
                    <div class="sm:ml-6">
                        <div v-if="myExams.filter((ex) => ex.moduleId == mod.id).length == 0">
                            <label class="input-label-warning text-sm sm:pl-6">No results found!</label>
                        </div>
                        <div
                            v-for="exam in myExams.filter((ex) => ex.moduleId == mod.id)"
                            v-else
                            :key="exam.examId"
                            class="flex justify-between my-2"
                        >
                            <label class="navigation-link" title="Show Exam" @click="routeExam(exam.examId)">{{
                                findCourse(exam.courseId).courseName
                            }}</label>
                            <div class="w-1/3 flex justify-between">
                                <label class="text-gray-400 pr-2 flex items-center">{{ exam.ects }}<i class="flex text-xs sm:hidden pl-1 fas fa-coins"/></label>
                                <label :class="isPassed(findGrade(exam.examId)) ? 'text-green-500' : 'text-red-500'">
                                    {{ findGrade(exam.examId) }}
                                </label>
                            </div>
                        </div>
                    </div>
                    <hr class="my-6 dark:border-normalgray-700" />
                </div>
                <hr class="my-6 dark:border-normalgray-700" />
            </div>
        </div>
    </base-view>
</template>

<script lang="ts">
    import { onBeforeMount, ref } from "vue";
    import BaseView from "@/views/common/BaseView.vue";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import MatriculationManagement from "@/api/MatriculationManagement";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
    import ExamResult, { Grade } from "@/components/exam/MockExamResultInterface";
    import Course from "@/api/api_models/course_management/Course";
    import Exam from "@/components/exam/mockExamInterface";
    import CourseManagement from "@/api/CourseManagement";
    import router from "@/use/router";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";

    export default {
        name: "StudentExamResults",
        components: {
            BaseView,
            LoadingComponent,
        },
        props: {},
        setup(props: any) {
            const mockedExams = [
                {
                    examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00",
                    courseId: "-1",
                    lecturerEnrollmentId: "0123456",
                    moduleId: "M.1275.78235",
                    type: "Written Exam",
                    date: "2021-02-12T10:00:00",
                    ects: 6,
                    admittableUntil: "2021-02-12T23:59:59",
                    droppableUntil: "2021-06-05T23:59:59",
                },
                {
                    examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00a",
                    courseId: "-5",
                    lecturerEnrollmentId: "0123456",
                    moduleId: "M.1275.78235",
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
                    moduleId: "M.1278.15686",
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
                    moduleIds: ["M.1278.79512"],
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
                {
                    courseDescription: "This is another course description.",
                    courseId: "-5",
                    courseLanguage: "German",
                    courseName: "VueJS Programming 2",
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
            const mockedExamResults = [
                {
                    examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00",
                    enrollmentId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6",
                    grade: Grade.g1_0,
                },
                {
                    examId: "ExampleGroup3:M.2:Written Exam:2021-02-26T11:15:00",
                    enrollmentId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6",
                    grade: Grade.g5_0,
                },
                {
                    examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00a",
                    enrollmentId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6",
                    grade: Grade.g1_3,
                },
            ];

            const isLoading = ref(false);
            const myExamRegs = ref([] as ExaminationRegulation[]);
            const myExamResults = ref([] as ExamResult[]);
            const myExams = ref([] as Exam[]);
            const myCourses = ref([] as Course[]);

            onBeforeMount(async () => {
                isLoading.value = true;
                let promises = [];
                promises.push(getExamRegs());
                promises.push(getExamResults());
                await Promise.all(promises);
                isLoading.value = false;
            });

            async function getExamRegs() {
                const mat_management = new MatriculationManagement();
                const handler = new GenericResponseHandler("examination regulation");
                const responseMatr = await mat_management.getOwnMatriculationHistory();
                let result = handler.handleResponse(responseMatr).matriculationStatus;
                let tmp = [] as string[];
                result.forEach((matr) => {
                    if (!tmp.includes(matr.fieldOfStudy)) {
                        tmp.push(matr.fieldOfStudy);
                    }
                });
                const exam_reg_management = new ExaminationRegulationManagement();
                const responseExReg = await exam_reg_management.getExaminationRegulation(tmp);
                myExamRegs.value = handler.handleResponse(responseExReg);
            }

            async function getExamResults() {
                //TODO API
                myExamResults.value = mockedExamResults;
                let promises = [];
                promises.push(getRelevantExams());
                promises.push(getRelevantCourses());
                await Promise.all(promises);
            }

            async function getRelevantExams() {
                //TODO get Exams via examIds in examResults
                myExams.value = mockedExams;
            }

            async function getRelevantCourses() {
                //TODO comment in
                // const course_management = new CourseManagement();
                // const handler = new GenericResponseHandler("course");
                // for (let exam of myExams.value) {
                //     myCourses.value.push(handler.handleResponse(await course_management.getCourse(exam.courseId)));
                // }
                myCourses.value = mockedCourses;
            }

            function findGrade(examId: string): string {
                return myExamResults.value.filter((result) => result.examId == examId)[0]?.grade;
            }

            function isPassed(grade: string): Boolean {
                return grade != Grade.g5_0;
            }

            function findCourse(courseId: string): Course {
                return myCourses.value.filter((c) => c.courseId == courseId)[0];
            }

            function routeExam(id: string) {
                router.push({ name: "exams.view", params: { id: id } });
            }

            return {
                isLoading,
                myExamRegs,
                myExams,
                myCourses,
                myExamResults,
                findGrade,
                isPassed,
                findCourse,
                routeExam,
            };
        },
    };
</script>
