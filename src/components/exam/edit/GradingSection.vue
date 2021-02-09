<template>
    <BaseSection title="Exam Grading" subtitle="Here you can grade the exam performances of the students.">
        <div class="w-full flex flex-none">
            <div v-for="result in examResults" :key="result.enrollmentId" class="flex w-full justify-between">
                <input :value="result.enrollmentId" type="text" class="w-2/3 form-input input-text" disabled />
                <Select v-model:selection="result.grade" title="Pick a Grade" :elements="grades" />
            </div>
        </div>
        <button-section>
            <template #right>
                <button id="gradeExam" :disabled="!isValid" type="button" class="w-full w-48 btn btn-add" @click="gradeExam">
                    Grade Exam
                </button>
            </template>
        </button-section>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import { computed, onBeforeMount, ref, watch } from "vue";
    import { ExamEntity } from "../MockExamEntity";
    import ExamResult, { Grade } from "../MockExamResultInterface";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import AdmissionManagement from "@/api/AdmissionManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";

    export default {
        name: "CourseModuleSection",
        components: {
            BaseSection,
            ButtonSection,
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
            ];

            const isLoading = ref(false);
            const examResults = ref([] as ExamResult[]);
            const grades = Object.keys(Grade).filter((grade) => grade !== Grade.NONE);

            onBeforeMount(async () => {
                isLoading.value = true;
                await getExamAdmissions();
                isLoading.value = false;
            });

            async function getExamAdmissions() {
                const admission_management = new AdmissionManagement();
                const handler = new GenericResponseHandler("exam admissions");
                // TODO API
                //const response  = admission_management.getExamAdmissions(props.exam.examId)
                //const result = handler.handleResponse(response);
                const result = mockedAdmissions;

                result.forEach((admission) => {
                    examResults.value.push({
                        examId: props.exam.examId,
                        enrollmentId: admission.enrollmentId,
                        grade: Grade.NONE,
                    });
                });
            }

            const isValid = computed(() => {
                examResults.value.forEach((result) => {
                    if (result.grade === Grade.NONE) {
                        return false;
                    }
                });
                return true;
            });

            async function gradeExam() {
                //TODO
            }

            return {
                isLoading,
                examResults,
                isValid,
                gradeExam,
                grades,
            };
        },
    };
</script>
