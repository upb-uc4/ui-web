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

                <div
                    v-if="selectedExaminationRegulations[index - 1]"
                    class="p-4 rounded-md border-2 border-gray-200 dark:border-normalgray-700"
                >
                    <!-- TODO: extract module in own component -->
                    <div class="space-y-4">
                        <tag-list :elements="['Module A', 'Module B']" />
                        <span class="hidden input-label-warning">Please select at least one module.</span>
                        <searchable-select placeholder="Search modules" :elements="temps" :selected="temp" />
                    </div>
                </div>
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import Selection from "@/components/common/ObjectSelect.vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { computed, onBeforeMount, ref, watch, reactive } from "vue";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
    import TagList from "@/components/common/TagList.vue";
    import SearchableSelect from "@/components/common/SearchableSelect.vue";
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";
    import Module from "@/api/api_models/exam_reg_management/Module";
    import __ from "lodash";

    export default {
        name: "CourseModulesSection",
        components: {
            BaseSection,
            Selection,
            TagList,
            SearchableSelect,
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
                //selectedExRegNames.value.splice(index, 1);
                selectedExaminationRegulations.splice(index, 1);
            }

            const selectedModules = ref([] as { ids: String[]; displayStrings: String[] }[]);
            const selectedExRegNames = ref([""]);
            const selectedOption = ref({} as SearchSelectOption);

            const availableExRegs = computed(() => {
                return availableExaminationRegulations.value.filter(
                    (f: ExaminationRegulation) => !selectedExRegNames.value.includes(f.name)
                );
            });

            const selectedExRegs = computed(() => {
                let tmp = [] as ExaminationRegulation[];
                selectedExRegNames.value.forEach((selectedName) => {
                    tmp.push(availableExaminationRegulations.value.find((e) => e.name == selectedName) as ExaminationRegulation);
                    if (tmp.length > 0) {
                        // Fill the selectedModules array (input for the search-selects and taglists) with the modules that are selected accourding to the prop
                        let selected: { ids: String[]; displayStrings: String[] } = { ids: [], displayStrings: [] };
                        tmp[tmp.length - 1]?.modules.forEach((m) => {
                            if ((props.moduleIds as String[]).find((x) => x == m.id)) {
                                selected.ids.push(m.id);
                                selected.displayStrings.push(`${m.id}: ${m.name}`);
                            }
                        });
                        selectedModules.value[tmp.length - 1] = selected;
                    }
                });
                return tmp;
            });

            watch(selectedOption.value, () => {
                // Toggle the module and erase the input of the search-select
                toggleModule((selectedOption.value.value as Module).id);
                selectedOption.value = {} as SearchSelectOption;
            });

            function checkIfLastExReg(index: number) {
                // push an empty ExRegNam if the last element of selectedExRegNames was filled (for showing the next select)
                if (selectedExRegNames.value.length - 1 == index && !(availableExRegs.value.length == 0)) {
                    selectedExRegNames.value.push("");
                }
            }

            function removeExReg(index: number) {
                emit("remove-modules", selectedExRegs.value[index].modules);
                selectedExRegNames.value.splice(index, 1);
            }

            function hasSelectedModule(exReg: ExaminationRegulation): Boolean {
                if (exReg == undefined) return false;
                for (let index = 0; index < props.moduleIds.length; index++) {
                    if (exReg.modules.find((m) => m.id == props.moduleIds[index]) != undefined) {
                        return true;
                    }
                }
                return false;
            }

            function getExRegsFromModules() {
                (props.moduleIds as String[]).forEach((m) => {
                    availableExaminationRegulations.value.forEach((exReg) => {
                        if (exReg.modules.find((e) => e.id == m) != undefined && !selectedExRegNames.value.includes(exReg.name)) {
                            selectedExRegNames.value.splice(selectedExRegNames.value.length - 1, 0, exReg.name);
                        }
                    });
                });
            }

            function toggleModule(id: String) {
                emit("toggle-module", id);
                getExRegsFromModules();
            }

            function removeModule(exRegIndex: number, moduleIndex: number) {
                toggleModule(selectedModules.value[exRegIndex].ids[moduleIndex]);
            }

            function createSearchSelectInput(index: number): SearchSelectOption[] {
                let value: SearchSelectOption[] = [];
                selectedExRegs.value[index].modules.forEach((m) => {
                    if (!(props.moduleIds as String[]).includes(m.id))
                        value.push({ value: m, display: `${m.id}: ${m.name}` } as SearchSelectOption);
                });
                return value;
            }

            const temps = ref([
                {
                    value: {},
                    display: "Module A",
                },
                {
                    value: {},
                    display: "Module B",
                },
                {
                    value: {},
                    display: "Module C",
                },
            ]);
            const temp = ref({ value: {}, display: "Module C" } as SearchSelectOption);

            return {
                isLoading,
                availableExaminationRegulations,
                selectedExaminationRegulations,
                removeSelectedExaminationRegulation,
                temp,
                temps,
            };
        },
    };
</script>
