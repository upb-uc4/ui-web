<template>
    <section id="moduleSection" class="border-t-2 py-8 border-gray-400">
        <div v-if="busy" class="mx-auto">
            <loading-spinner />
        </div>
        <div v-else class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-lg font-medium mb-2">Module Information</label>
                <label class="block text-gray-600"> The module that the course should count to. </label>
            </div>
            <div class="flex flex-col lg:w-2/3 w-full">
                <label class="text-gray-700 text-md font-medium block mb-4">Module</label>
                <search-select
                    v-if="!registered"
                    v-model:selected="selectedModuleOption"
                    :options="optionsArray"
                    input-id="selectModule"
                    :category-name="'Module'"
                />
                <input v-else id="selectModule" :value="selectedModuleString" disabled type="text" class="w-full form-input input-text" />
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import SearchSelect from "@/components/common/SearchSelect.vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import { onBeforeMount, ref } from "vue";
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";
    import Module from "@/api/api_models/exam_reg_management/Module";
    import { watch } from "vue";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    export default {
        name: "CourseModulesSection",
        components: {
            SearchSelect,
            LoadingSpinner,
        },
        props: {
            moduleIds: {
                type: Array,
                required: true,
            },
            registered: {
                type: Boolean,
                required: true,
            },
            selected: {
                type: String,
                required: true,
            },
        },
        emits: ["update:selected"],
        setup(props: any, { emit }: any) {
            let busy = ref(false);
            let optionsArray = ref([] as SearchSelectOption[]);
            let selectedModuleString = ref(props.selected);
            let selectedModuleOption = ref({} as SearchSelectOption);

            onBeforeMount(async () => {
                if (!props.registered) await getModules();
            });

            watch(
                () => selectedModuleOption.value,
                () => {
                    let emitValue = (selectedModuleOption.value.value as Module).id;
                    emitValue == undefined ? emit("update:selected", "") : emit("update:selected", emitValue);
                }
            );

            async function getModules() {
                busy.value = true;
                const exRegManagement = new ExaminationRegulationManagement();
                const handler = new GenericResponseHandler("module");
                const response = await exRegManagement.getModules(props.moduleIds as string[]);
                let result = handler.handleResponse(response);
                if (Object.keys(result).length > 0) {
                    result.forEach((module) => {
                        optionsArray.value.push({ value: module, display: `${module.id}: ${module.name}` });
                    });
                }
                busy.value = false;
            }

            return {
                busy,
                selectedModuleString,
                selectedModuleOption,
                optionsArray,
            };
        },
    };
</script>
