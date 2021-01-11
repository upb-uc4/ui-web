<template>
    <BaseSection title="Module Information" subtitle="Modules and examination regulations that the course should be assigned to.">
        <loading-spinner v-if="isLoading" title="Loading Modules..." />
        <div v-else class="space-y-6">
            <div class="w-full">
                <label class="input-label">Examination Regulation</label>
                <selection
                    :id="'exReg'"
                    v-model:selection="selectedExaminationRegulation"
                    :elements="availableExaminationRegulations"
                    property-to-display="name"
                />
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import Selection from "@/components/common/ObjectSelect.vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { onBeforeMount, ref } from "vue";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";

    export default {
        name: "CourseModulesSection",
        components: {
            BaseSection,
            Selection,
            LoadingSpinner,
        },
        props: {
            errorBag: {
                required: true,
                type: ErrorBag,
            },
            moduleIds: {
                type: Array,
                required: true,
            },
            editMode: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["toggle-module", "remove-modules"],
        setup(props: any, { emit }: any) {
            const isLoading = ref(true);
            const availableExaminationRegulations = ref([] as ExaminationRegulation[]);
            const selectedExaminationRegulation = ref();

            onBeforeMount(async () => {
                await loadExaminationRegulations();
                //todo load from module
            });

            async function loadExaminationRegulations() {
                const examinationRegulationManagement = new ExaminationRegulationManagement();
                const response = await examinationRegulationManagement.getExaminationRegulation();
                const handler = new GenericResponseHandler("exam regulation");
                const result = handler.handleResponse(response);
                if (result) {
                    availableExaminationRegulations.value = result;
                }
                isLoading.value = false;
            }

            return {
                isLoading,
                availableExaminationRegulations,
                selectedExaminationRegulation,
            };
        },
    };
</script>
