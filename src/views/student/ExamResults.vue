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
                    <div class="w-1/3 hidden sm:flex justify-between text-gray-400">
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
                            <label class="navigation-link" title="Show Exam" @click="routeExam(exam.examId)">
                                {{ findCourse(exam.courseId).courseName }}
                            </label>
                            <div class="w-1/3 flex justify-between">
                                <label class="text-gray-400 pr-2 flex items-center">
                                    {{ exam.ects }}
                                    <i class="flex text-xs sm:hidden pl-1 fas fa-coins" />
                                </label>
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
    import { Grade } from "@/components/exam/Grades";
    import Course from "@/api/api_models/course_management/Course";
    import router from "@/use/router";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";
    import ExamResult from "@/api/api_models/exam_result_management/ExamResult";
    import Exam from "@/api/api_models/exam_management/Exam";
    import ExamResultManagement from "@/api/ExamResultManagement";
    import { useStore } from "@/use/store/store";
    import CourseManagement from "@/api/CourseManagement";
    import ExamManagement from "@/api/ExamManagement";

    export default {
        name: "StudentExamResults",
        components: {
            BaseView,
            LoadingComponent,
        },
        props: {},
        setup(props: any) {
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
                const exam_result_management = new ExamResultManagement();
                const handler = new GenericResponseHandler("exam results");
                myExamResults.value = handler.handleResponse(
                    await exam_result_management.getExamResults((await useStore().getters.user).username)
                );
                await getRelevantExams();
                await getRelevantCourses();
            }

            async function getRelevantExams() {
                const exam_management = new ExamManagement();
                const handler = new GenericResponseHandler("exams");
                myExams.value = handler.handleResponse(await exam_management.getExams(myExamResults.value.map((result) => result.examId)));
            }

            async function getRelevantCourses() {
                const course_management = new CourseManagement();
                const handler = new GenericResponseHandler("course");
                for (let exam of myExams.value) {
                    myCourses.value.push(handler.handleResponse(await course_management.getCourse(exam.courseId)));
                }
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
