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
                    :selected-module-ids="selectedModuleIDs"
                    @add-module="onModuleAdded"
                    @remove-module="onModuleRemoved"
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
    import Module from "@/api/api_models/exam_reg_management/Module";

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
            const selectedModuleIDs = ref(new Set<String>());

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
                const removedExaminationRegulation = selectedExaminationRegulations.splice(index, 1);
                removeModuleIDUnlessUsedBySomeExaminationRegulation(removedExaminationRegulation[0]);
                //todo emit list of selectedModuleIDs
                //emit("remove-modules", selectedExRegs.value[index].modules);
            }

            function removeModuleIDUnlessUsedBySomeExaminationRegulation(removedExaminationRegulation: ExaminationRegulation) {
                removedExaminationRegulation.modules.forEach((module: Module) => {
                    let toBeRemoved = true;
                    selectedExaminationRegulations.forEach((examinationRegulation: ExaminationRegulation) => {
                        if (examinationRegulation.modules.some((moduleInExamReg: Module) => moduleInExamReg.id === module.id)) {
                            toBeRemoved = false;
                        }
                    });
                    if (toBeRemoved) {
                        selectedModuleIDs.value.delete(module.id);
                    }
                });
            }

            function onModuleAdded(module: Module) {
                selectedModuleIDs.value.add(module.id);
                const examinationRegulationsToAdd = availableExaminationRegulations.value.filter((examReg: ExaminationRegulation) => {
                    return examReg.modules.some((moduleInExamReg: Module) => moduleInExamReg.id === module.id);
                });
                examinationRegulationsToAdd.forEach((examReg: ExaminationRegulation) => selectedExaminationRegulations.push(examReg));

                //todo emit list of selectedModuleIDs
            }

            function onModuleRemoved(module: Module) {
                selectedModuleIDs.value.delete(module.id);
                //todo remove exam regulations that only had this module

                //todo emit list of selectedModuleIDs
            }

            return {
                isLoading,
                availableExaminationRegulations,
                selectedExaminationRegulations,
                removeSelectedExaminationRegulation,
                onModuleAdded,
                onModuleRemoved,
                selectedModuleIDs,
            };
        },
    };
</script>
