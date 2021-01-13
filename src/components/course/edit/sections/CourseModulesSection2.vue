<template>
    <BaseSection title="Module Information" subtitle="Modules and examination regulations that the course should be assigned to.">
        <loading-spinner v-if="isLoading" title="Loading Modules..." />
        <div v-else class="space-y-6">
            <div v-for="index in selectedExaminationRegulations.length + 1" :key="index" class="space-y-4">
                <div>
                    <label class="input-label">Examination Regulation</label>
                    <div class="flex items-center space-x-4">
                        <selection
                            :id="'exReg'"
                            v-model:selection="selectedExaminationRegulations[index - 1]"
                            :elements="availableExaminationRegulations"
                            property-to-display="name"
                        />
                        <button
                            v-if="selectedExaminationRegulations[index - 1]"
                            class="btn-tertiary-remove"
                            @click="removeSelectedExaminationRegulation(index - 1)"
                        >
                            Remove
                        </button>
                    </div>
                </div>

                <module-selection
                    v-if="selectedExaminationRegulations[index - 1]"
                    :examination-regulation="selectedExaminationRegulations[index - 1]"
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
    import { onBeforeMount, ref, watch, reactive } from "vue";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
    import __ from "lodash";
    import ModuleSelection from "@/components/course/edit/sections/ModuleSelection.vue";

    export default {
        name: "CourseModulesSection",
        components: {
            BaseSection,
            Selection,
            ModuleSelection,
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
            const selectedExaminationRegulations = reactive([] as ExaminationRegulation[]);

            onBeforeMount(async () => {
                await loadExaminationRegulations();
                // if (props.editMode) {
                //     getExRegsFromModules();
                // }
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

            watch(
                () => [...selectedExaminationRegulations],
                (selectedExamRegs, prevSelectedExamRegs) => {
                    const diff = __.xor(selectedExamRegs, prevSelectedExamRegs);

                    if (selectedExamRegs.length > prevSelectedExamRegs.length) {
                        removeFromAvailableExaminationRegulations(diff[0]);
                    } else if (selectedExamRegs.length < prevSelectedExamRegs.length) {
                        addToAvailableExaminationRegulations(diff[0]);
                    } else {
                        if (prevSelectedExamRegs.includes(diff[0])) {
                            addToAvailableExaminationRegulations(diff[0]);
                            removeFromAvailableExaminationRegulations(diff[1]);
                        } else {
                            addToAvailableExaminationRegulations(diff[1]);
                            removeFromAvailableExaminationRegulations(diff[0]);
                        }
                    }
                }
            );

            function removeFromAvailableExaminationRegulations(elem: ExaminationRegulation) {
                availableExaminationRegulations.value = availableExaminationRegulations.value.filter((examReg) => {
                    return examReg != elem;
                });
            }

            function addToAvailableExaminationRegulations(examReg: ExaminationRegulation) {
                availableExaminationRegulations.value.push(examReg);
            }

            function removeSelectedExaminationRegulation(index: number) {
                //emit("remove-modules", selectedExRegs.value[index].modules);
                selectedExaminationRegulations.splice(index, 1);
            }

            return {
                isLoading,
                availableExaminationRegulations,
                selectedExaminationRegulations,
                removeSelectedExaminationRegulation,
            };
        },
    };
</script>
