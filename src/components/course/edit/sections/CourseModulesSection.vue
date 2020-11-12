<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-lg font-medium mb-2">Module Information</label>
                <label class="block text-gray-600"> Modules and examination regulations that the course should be assigned to. </label>
            </div>
            <div class="flex flex-col lg:w-2/3 w-full">
                <div
                    v-for="index in selectedExRegNames.length"
                    :key="index"
                    class="flex flex-col items-start"
                    :class="{ 'mb-10': index != selectedExRegNames.length }"
                >
                    <div class="flex items-center w-full pb-1">
                        <select
                            :id="'exReg-' + selectedExRegNames[index - 1]"
                            v-model="selectedExRegNames[index - 1]"
                            class="input-select form-select w-full"
                            :disabled="hasCheckedModule(selectedExRegs[index - 1])"
                            @change="addValue($event.target.value, index - 1)"
                        >
                            <option disabled :value="''">Select an examination regulation</option>

                            <!-- add selected option, because the computed "unchosenValues" will not contain it -->
                            <option v-if="selectedExRegNames[index - 1] != ''">{{ selectedExRegNames[index - 1] }}</option>

                            <option v-for="exReg in availableExRegs" :key="exReg.name" :value="exReg.name">{{ exReg.name }}</option>
                        </select>
                        <button
                            v-if="selectedExRegNames[index - 1] != ''"
                            :id="'remove_exReg_' + index"
                            title="Remove selected exam regulation"
                            class="text-red-500 hover:text-red-600 m-4"
                            @click="removeValue(index - 1)"
                        >
                            <i class="inline far fa-trash-alt text-2xl"></i>
                        </button>
                    </div>
                    <div v-if="selectedExRegNames[index - 1] != ''" class="w-full bg-gray-100 rounded-lg border-2 border-gray-400 p-2">
                        <div class="w-full flex content-center flex-wrap">
                            <div v-for="module in selectedExRegs[index - 1].modules" :key="module" class="w-1/4 p-2">
                                <div class="flex">
                                    <div class="w-4 mr-2" />
                                    <div class="flex text-sm text-gray-500 leading-none">{{ module.id }}</div>
                                </div>
                                <div class="flex items-center">
                                    <input
                                        :id="'check_module_' + module.id"
                                        class="w-4 mr-2 text-blue-500 form-checkbox hover:bg-blue-600"
                                        type="checkbox"
                                        :checked="isChecked(module.id)"
                                        @click="toggleModule(module.id)"
                                    />
                                    <div class="align-baseline text-sm text-gray-900">{{ module.name }}</div>
                                </div>
                            </div>
                        </div>
                        <tag-list :elements="selectedModules[index - 1].displayStrings" @on-remove="removeModule(index - 1, $event)" />
                        <search-select
                            class="w-full mt-2"
                            :input-id="'modules_' + (index - 1)"
                            :options="createSearchSelectInput(index - 1)"
                            :selected="{}"
                            :category-name="'Module'"
                            @selected="toggleModule($event.value.id)"
                        />
                    </div>
                </div>
                <p v-if="errorBag.has('moduleIds')" id="moduleError" class="error-message">
                    {{ errorBag.get("moduleIds") }}
                </p>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import ErrorBag from "@/use/helpers/ErrorBag";
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
    import { computed, onBeforeMount, ref, watch } from "vue";
    import Module from "@/api/api_models/exam_reg_management/Module";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { reactive } from "vue";
    import TagList from "@/components/common/TagList.vue";
    import SearchSelect from "@/components/common/SearchSelect.vue";
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";

    export default {
        name: "CourseModulesSection",
        components: { TagList, SearchSelect },
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
            const examinationRegs = ref([] as ExaminationRegulation[]);
            const selectedExRegNames = ref([""]);
            const selectedModules = ref([] as { ids: String[]; displayStrings: String[] }[]);
            const selectedOption = ref({} as SearchSelectOption);

            //TODO Remove Mock Data
            let mockData = [
                {
                    name: "ExReg1",
                    active: true,
                    modules: [{ id: "M1", name: "Module1" } as Module, { id: "M2", name: "Module2" } as Module],
                },
                {
                    name: "ExReg2",
                    active: false,
                    modules: [
                        { id: "M1", name: "Module1" } as Module,
                        { id: "M3", name: "Module3" } as Module,
                        { id: "M4", name: "Module4" } as Module,
                    ],
                },
                {
                    name: "ExReg3",
                    active: false,
                    modules: [
                        { id: "M5", name: "Module5" } as Module,
                        { id: "M6", name: "Module6" } as Module,
                        { id: "M7", name: "Module7" } as Module,
                    ],
                },
            ];

            onBeforeMount(async () => {
                await getExmatriculationRegs();
                if (!props.editMode) {
                    getExRegsFromModules();
                }
            });

            let availableExRegs = computed(() => {
                return examinationRegs.value.filter((f: ExaminationRegulation) => !selectedExRegNames.value.includes(f.name));
            });

            let selectedExRegs = computed(() => {
                let tmp = [] as ExaminationRegulation[];
                selectedExRegNames.value.forEach((selectedName) => {
                    tmp.push(examinationRegs.value.find((e) => e.name == selectedName) as ExaminationRegulation);
                    if (tmp.length > 0) {
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

            async function getExmatriculationRegs() {
                // TODO include API
                // const examinationRegulationManagement = new ExaminationRegulationManagement();
                // const response = await examinationRegulationManagement.getExaminationRegulation();
                // const handler = new GenericResponseHandler();
                // const result = handler.handleResponse(response);
                // if (result) {
                //     examinationRegs.value = result;
                // }
                examinationRegs.value = mockData;
            }

            function getExRegsFromModules() {
                (props.moduleIds as String[]).forEach((m) => {
                    examinationRegs.value.forEach((exReg) => {
                        if (exReg.modules.find((e) => e.id == m) != undefined && !selectedExRegNames.value.includes(exReg.name)) {
                            selectedExRegNames.value.splice(selectedExRegNames.value.length - 1, 0, exReg.name);
                        }
                    });
                });
            }

            watch(
                () => props.moduleIds,
                () => {
                    getExRegsFromModules();
                }
            );

            watch(selectedOption.value, () => {
                console.log("DO");
                toggleModule((selectedOption.value.value as Module).id);
                selectedOption.value = {} as SearchSelectOption;
            });

            function addValue(value: string, index: number) {
                if (selectedExRegNames.value.length - 1 == index) {
                    selectedExRegNames.value.push("");
                }
            }

            function removeValue(index: number) {
                emit("remove-modules", selectedExRegs.value[index].modules);
                selectedExRegNames.value.splice(index, 1);
            }

            function toggleModule(id: String) {
                emit("toggle-module", id);
                getExRegsFromModules();
            }

            function isChecked(id: string) {
                return (props.moduleIds as String[]).includes(id);
            }

            function hasCheckedModule(exReg: ExaminationRegulation): Boolean {
                if (exReg == undefined) return false;
                for (let index = 0; index < props.moduleIds.length; index++) {
                    if (exReg.modules.find((m) => m.id == props.moduleIds[index]) != undefined) {
                        return true;
                    }
                }
                return false;
            }

            function removeModule(exRegIndex: number, moduleIndex: number) {
                toggleModule(selectedModules.value[exRegIndex].ids[moduleIndex]);
            }

            function createSearchSelectInput(index: number): SearchSelectOption[] {
                let value: SearchSelectOption[] = [];
                selectedExRegs.value[index].modules.forEach((m) => {
                    if (!isChecked(m.id)) value.push({ value: m, display: `${m.id}: ${m.name}` } as SearchSelectOption);
                });
                return value;
            }

            return {
                examinationRegs,
                selectedExRegNames,
                availableExRegs,
                addValue,
                selectedExRegs,
                removeValue,
                toggleModule,
                isChecked,
                hasCheckedModule,
                selectedModules,
                removeModule,
                createSearchSelectInput,
                selectedOption,
            };
        },
    };
</script>
