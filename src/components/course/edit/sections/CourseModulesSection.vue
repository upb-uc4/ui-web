<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-lg font-medium mb-2">Module Information</label>
                <label class="block text-gray-600"> Modules and examination regulations that the course should be assigned to. </label>
            </div>
            <div class="flex flex-col">
                <div
                    v-for="index in selectedExRegNames.length"
                    :key="index"
                    class="flex flex-row items-start"
                    :class="{ 'mb-2': index != selectedExRegNames.length }"
                >
                    <select
                        :id="'exReg-' + index"
                        v-model="selectedExRegNames[index - 1]"
                        class="input-select form-select mr-2 w-108"
                        @change="addValue($event.target.value, index - 1)"
                    >
                        <option disabled :value="''">Select an examination regulation</option>

                        <option v-for="exReg in availableExRegs" :key="exReg.name" :value="exReg.name">{{ exReg.name }}</option>
                    </select>
                    <div v-if="selectedExRegNames[index - 1] != ''" class="overflow-y-auto flex items-center">
                        <div class="flex flex-col bg-gray-100 p-4 mr-4 rounded-md">
                            <div v-for="module in selectedExRegs[index - 1].modules" :key="module" class="items-center">
                                <input
                                    class="form-checkbox border-2 border-gray-500 mr-2"
                                    type="checkbox"
                                    :checked="isChecked(module.id)"
                                    @click="toggleModule(module.id)"
                                />
                                <label>{{ module.name }}</label>
                            </div>
                        </div>
                        <button title="Remove Selected ER" class="btn-icon-red" @click="removeValue(index - 1)">
                            <i class="inline far fa-trash-alt text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import ErrorBag from "@/use/helpers/ErrorBag";
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
    import { computed, onBeforeMount, ref } from "vue";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import Module from "@/api/api_models/exam_reg_management/Module";

    export default {
        name: "CourseModulesSection",
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
                        { id: "2", name: "Module4" } as Module,
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
                    selectedExRegNames.value.push(
                        ...examinationRegs.value
                            .filter((e) => e.modules.filter((mo) => mo.id == m))
                            .map((e) => e.name)
                            .filter((e) => !selectedExRegNames.value.includes(e))
                    );
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
                console.log(id);
                emit("toggle-module", id);
            }

            function isChecked(id: string) {
                return (props.moduleIds as String[]).includes(id);
            }

            return { examinationRegs, selectedExRegNames, availableExRegs, addValue, selectedExRegs, removeValue, toggleModule, isChecked };
        },
    };
</script>
