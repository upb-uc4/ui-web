<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-lg font-medium mb-2">Module Information</label>
                <label class="block text-gray-600"> Modules and examination regulations that the course should be assigned to. </label>
            </div>
            <div class="flex flex-col w-full">
                <div
                    v-for="index in selectedExRegNames.length"
                    :key="index"
                    class="flex flex-col items-start"
                    :class="{ 'mb-10': index != selectedExRegNames.length }"
                >
                    <div class="flex items-center w-full pb-1">
                        <select
                            :id="'exReg-' + index"
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
                            title="Remove Selected ER"
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
                                        class="w-4 mr-2 text-blue-500 form-checkbox hover:bg-blue-600"
                                        type="checkbox"
                                        :checked="isChecked(module.id)"
                                        @click="toggleModule(module.id)"
                                    />
                                    <div class="align-baseline text-sm text-gray-900">{{ module.name }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        Selected Names {{ selectedExRegNames }} Module IDs {{ moduleIds }}
    </section>
</template>

<script lang="ts">
    import ErrorBag from "@/use/helpers/ErrorBag";
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
    import { computed, onBeforeMount, ref } from "vue";
    import Module from "@/api/api_models/exam_reg_management/Module";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { reactive } from "vue";

    export default {
        name: "CourseModulesSection",
        components: {},
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

            //TODO Remove Mock Data
            let mockData = [
                {
                    name: "ExReg1",
                    active: true,
                    modules: [{ id: "1", name: "Module1" } as Module, { id: "2", name: "Module2" } as Module],
                },
                {
                    name: "ExReg2",
                    active: false,
                    modules: [
                        { id: "1", name: "Module1" } as Module,
                        { id: "3", name: "Module3" } as Module,
                        { id: "4", name: "Module4" } as Module,
                    ],
                },
                {
                    name: "ExReg3",
                    active: false,
                    modules: [
                        { id: "5", name: "Module5" } as Module,
                        { id: "6", name: "Module6" } as Module,
                        { id: "7", name: "Module7" } as Module,
                    ],
                },
            ];

            onBeforeMount(async () => {
                await getExmatriculationRegs();
                if (props.editMode) {
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
                (props.moduleIds as string[]).forEach((m) => {
                    examinationRegs.value.forEach((exReg) => {
                        if (exReg.modules.find((e) => e.id == m) != undefined && !selectedExRegNames.value.includes(exReg.name)) {
                            selectedExRegNames.value.splice(selectedExRegNames.value.length - 1, 0, exReg.name);
                        }
                    });
                });
            }

            function addValue(value: string, index: number) {
                if (selectedExRegNames.value.length - 1 == index) {
                    selectedExRegNames.value.push("");
                }
            }

            function removeValue(index: number) {
                emit("remove-modules", selectedExRegs.value[index].modules);
                selectedExRegNames.value.splice(index, 1);
            }

            function toggleModule(id: string) {
                emit("toggle-module", id);
                getExRegsFromModules();
            }

            function isChecked(id: string) {
                return (props.moduleIds as String[]).includes(id);
            }

            //TODO remove demo elements for tag list
            let demoElements = reactive(["Summer", "Sun", "Beach"]);
            function updateDemoList(index: number) {
                demoElements.splice(index, 1);
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

            return {
                examinationRegs,
                selectedExRegNames,
                availableExRegs,
                addValue,
                selectedExRegs,
                removeValue,
                toggleModule,
                isChecked,
                demoElements,
                updateDemoList,
                hasCheckedModule,
            };
        },
    };
</script>
