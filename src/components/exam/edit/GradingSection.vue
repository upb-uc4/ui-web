<template>
    <BaseSection title="Exam Grading" subtitle="Here you can grade the exam performances of the students.">
        <div class="w-full flex flex-col">
            <label class="input-label">Students and Grades</label>
            <div class="w-full flex flex-col mt-4">
                <div class="flex w-full mb-2">
                    <label class="w-2/3 input-label text-xs">Student-ID (Hover for Full ID)</label>
                    <label class="w-1/2 ml-4 input-label text-xs">Grade</label>
                </div>
                <div v-if="isLoading" class="mx-auto">
                    <loading-spinner title="Loading Students" />
                </div>
                <div v-else>
                    <label v-if="examResults.length == 0" class="input-label-warning my-4">No students registered</label>
                    <div v-for="result in examResults" v-else :key="result.enrollmentId" class="flex w-full mb-4">
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
        </div>
        <button-section>
            <template #right>
                <div v-if="isGradable" class="w-48 flex justify-center">
                    <img v-if="isLoading" src="@/assets/loading-spinner-alt.svg" class="h-8 w-8" />
                    <button v-else id="gradeExam" :disabled="!isValid" type="button" class="w-full btn btn-add" @click="gradeExam">
                        Grade Exam
                    </button>
                </div>
            </template>
            <template #left>
                <button v-if="isGradable" id="importCSV" type="button" class="w-full btn-secondary" @click="importCSV">Import</button>
                <button v-if="isGraded || isGradable" id="exportCSV" type="button" class="w-full btn-secondary ml-4" @click="exportCSV">
                    Export
                </button>
            </template>
        </button-section>
        <label v-if="!isGraded && !isGradable" class="input-label-warning">Exam not finished.</label>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import { computed, onBeforeMount, ref } from "vue";
    import { ExamEntity } from "../../../entities/ExamEntity";
    import { Grade } from "../Grades";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import AdmissionManagement from "@/api/AdmissionManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import Select from "@/components/common/Select.vue";
    import ExamResultManagement from "@/api/ExamResultManagement";
    import ExamResult from "@/api/api_models/exam_result_management/ExamResult";
    import ConfigurationManagement from "@/api/ConfigurationManagement";
    import executeTransaction from "@/api/contracts/ChaincodeUtility";
    import { AddExamResultTransaction } from "@/api/contracts/exam_result/transactions/AddExamResultTransaction";
    import { useToast } from "@/toast";
    import { buildGradingTable, readGradingTable } from "@/use/xlsx/GradingTable";
    import * as xlsx from "xlsx";
    import { showNotYetImplementedToast } from "@/use/helpers/Toasts";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";

    export default {
        name: "CourseModuleSection",
        components: {
            BaseSection,
            ButtonSection,
            Select,
            LoadingSpinner,
        },
        props: {
            exam: {
                type: ExamEntity,
                required: true,
            },
        },
        setup(props: any, { emit }: any) {
            const isLoading = ref(false);
            const examResults = ref([] as ExamResult[]);
            const grades = ref([] as string[]);

            const isGraded = ref(false);
            const isGradable = computed(() => {
                return new Date() > new Date(props.exam.date) && !isGraded.value;
            });

            const grades2 = ref([]);

            onBeforeMount(async () => {
                isLoading.value = true;
                if (!(await getExamResults())) {
                    await getExamAdmissions();
                }
                await getConfig();
                isLoading.value = false;
            });

            async function getConfig() {
                const configuration_management = new ConfigurationManagement();
                const handler = new GenericResponseHandler("configuration");
                grades.value = handler.handleResponse(await configuration_management.getConfiguration()).grades;
                grades.value.push("");
            }

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
                        enrollmentId: admission.enrollmentId,
                        examId: props.exam.examId,
                        grade: Grade.NONE,
                    } as ExamResult);
                });
            }

            const isValid = computed(() => {
                return !examResults.value.some((result) => result.grade == Grade.NONE);
            });

            async function gradeExam() {
                isLoading.value = true;
                console.log(examResults.value);
                if (await executeTransaction(new AddExamResultTransaction(examResults.value))) {
                    useToast().success("Exam graded.");
                    isGraded.value = true;
                }
                isLoading.value = false;
            }

            async function exportCSV() {
                if (examResults.value.length > 0) {
                    const workbook = await buildGradingTable(examResults.value);
                    xlsx.writeFile(workbook, "exam.csv");
                } else {
                    useToast().warning("Nothing to export.");
                }
            }

            async function importCSV() {
                showNotYetImplementedToast();
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
