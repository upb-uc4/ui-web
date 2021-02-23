<template>
    <BaseSection title="Exam Grading" subtitle="Here you can grade the exam performances of the students.">
        <div class="w-full flex flex-col">
            <label class="input-label">Students and Grades</label>
            <div class="w-full flex flex-col mt-4">
                <div class="flex w-full mb-2">
                    <label class="w-2/3 input-label text-xs">Student-ID (Hover for Full ID)</label>
                    <label class="w-1/2 ml-4 input-label text-xs">Grade</label>
                </div>
                <div v-for="result in examResults" :key="result.enrollmentId" class="flex w-full mb-4">
                    <input
                        :value="result.enrollmentId.substring(0, 20)"
                        :title="result.enrollmentId"
                        type="text"
                        class="w-2/3 form-input input-text"
                        readonly
                    />
                    <div class="w-1/2 ml-4">
                        <div class="w-full">
                            <Select
                                :id="`grade_${result.enrollmentId.substring(0, 4)}`"
                                v-model:selection="result.grade"
                                :disabled="!isGradable"
                                title="Pick a Grade"
                                :elements="grades"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button-section v-if="isGradable">
            <template #right>
                <button id="gradeExam" :disabled="!isValid" type="button" class="w-full w-48 btn btn-add" @click="gradeExam">
                    Grade Exam
                </button>
            </template>
            <template #left>
                <button id="importCSV" type="button" class="w-full w-48 btn-secondary" @click="importCSV">Import</button>
                <button id="exportCSV" type="button" class="w-full w-48 btn-secondary ml-4" @click="exportCSV">Export</button>
            </template>
        </button-section>
        <label v-else class="input-label-warning">Exam not finished.</label>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import { computed, onBeforeMount, ref, watch } from "vue";
    import { ExamEntity } from "../../../entities/ExamEntity";
    import { Grade } from "../MockExamResultInterface";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import AdmissionManagement from "@/api/AdmissionManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import Select from "@/components/common/Select.vue";
    import ExamResultManagement from "@/api/ExamResultManagement";
    import ExamResult from "@/api/api_models/exam_result_management/ExamResult";

    export default {
        name: "CourseModuleSection",
        components: {
            BaseSection,
            ButtonSection,
            Select,
        },
        props: {
            exam: {
                type: ExamEntity,
                required: true,
            },
        },
        setup(props: any, { emit }: any) {
            const mockedAdmissions = [
                {
                    admissionId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6:AnExampleExamId",
                    enrollmentId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6",
                    timestamp: "2020-12-01",
                    type: "Exam",
                    examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00",
                },
                {
                    admissionId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6:AnExampleExamId12",
                    enrollmentId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a612",
                    timestamp: "2020-12-01",
                    type: "Exam",
                    examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00",
                },
                {
                    admissionId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6:AnExampleExamId13",
                    enrollmentId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a613",
                    timestamp: "2020-12-01",
                    type: "Exam",
                    examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00",
                },
                {
                    admissionId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6:AnExampleExamId14",
                    enrollmentId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a614",
                    timestamp: "2020-12-01",
                    type: "Exam",
                    examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00",
                },
                {
                    admissionId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6:AnExampleExamId15",
                    enrollmentId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a615",
                    timestamp: "2020-12-01",
                    type: "Exam",
                    examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00",
                },
                {
                    admissionId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a6:AnExampleExamId16",
                    enrollmentId: "e53143d725255d70945989901ebc137a7d35c2b61ffdfecb9a135c6136eea4a616",
                    timestamp: "2020-12-01",
                    type: "Exam",
                    examId: "ExampleGroup:M.1:Written Exam:2021-02-12T10:00:00",
                },
            ];

            const isLoading = ref(false);
            const examResults = ref([] as ExamResult[]);
            const grades = Object.values(Grade);

            const isGraded = ref(false);
            const isGradable = computed(() => {
                return new Date() > new Date(props.exam.date) && !isGraded.value;
            });

            onBeforeMount(async () => {
                isLoading.value = true;
                let promises = [];
                if (!(await getExamResults())) {
                    getExamAdmissions();
                }
                isLoading.value = false;
            });

            async function getExamResults(): Promise<boolean> {
                const exam_result_management = new ExamResultManagement();
                const handler = new GenericResponseHandler("exam results");
                const result = handler.handleResponse(await exam_result_management.getExamResults(undefined, [props.exam.examId]));
                if (result.length > 0) {
                    examResults.value = result;
                    isGraded.value = true;
                    return true;
                }
                return false;
            }

            async function getExamAdmissions() {
                const admission_management = new AdmissionManagement();
                const handler = new GenericResponseHandler("exam admissions");
                const response = await admission_management.getExamAdmissions(undefined, [props.exam.examId]);
                const result = handler.handleResponse(response);
                result.forEach((admission) => {
                    examResults.value.push({
                        examId: props.exam.examId,
                        enrollmentId: admission.enrollmentId,
                        grade: Grade.NONE,
                    });
                });
            }

            const isValid = computed(() => {
                return !examResults.value.some((result) => result.grade == Grade.NONE);
            });

            async function gradeExam() {
                //TODO
                //IF SUCCESS
                isGraded.value = true;
                console.log("Graded!");
            }

            async function exportCSV() {
                //TODO
            }

            async function importCSV() {
                //TODO
            }

            return {
                isLoading,
                examResults,
                isValid,
                gradeExam,
                grades,
                exportCSV,
                importCSV,
                isGraded,
                isGradable,
            };
        },
    };
</script>
