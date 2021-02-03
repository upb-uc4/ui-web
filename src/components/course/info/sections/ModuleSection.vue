<template>
    <base-section id="moduleSection" title="Module Information" subtitle="Select the module that this course should count to.">
        <LoadingSpinner v-if="isLoading" />
        <div v-else class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
            <div class="lg:w-1/2 w-full">
                <input v-if="registered" id="selectModule" :value="selectedModuleString" disabled type="text" class="w-full input-text" />
                <searchable-select
                    v-else
                    v-model:selected="selectedModuleOption"
                    placeholder="Type to search."
                    :elements="optionsArray"
                    @update:selected="selectModule"
                />
            </div>
            <div class="invisible lg:w-1/2 w-full" />
        </div>
    </base-section>
</template>

<script lang="ts">
    import { onBeforeMount, ref } from "vue";
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";
    import Module from "@/api/api_models/exam_reg_management/Module";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import SearchableSelect from "@/components/common/SearchableSelect.vue";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";

    export default {
        name: "CourseModulesSection",
        components: {
            SearchableSelect,
            BaseSection,
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
            const isLoading = ref(false);
            const optionsArray = ref([] as SearchSelectOption[]);
            const selectedModuleString = ref(props.selected);
            const selectedModuleOption = ref({} as SearchSelectOption);

            onBeforeMount(async () => {
                if (!props.registered) await getModules();
            });

            function selectModule(module: SearchSelectOption) {
                let emitValue = (module.value as Module).id;
                emitValue == undefined ? emit("update:selected", "") : emit("update:selected", emitValue);
            }

            async function getModules() {
                isLoading.value = true;
                if ((props.moduleIds as String[]).length == 0) return;
                const exRegManagement = new ExaminationRegulationManagement();
                const handler = new GenericResponseHandler("module");
                const response = await exRegManagement.getModules(props.moduleIds as string[]);
                let result = handler.handleResponse(response);
                result.forEach((module) => {
                    optionsArray.value.push({ value: module, display: `${module.id}: ${module.name}` });
                });
                isLoading.value = false;
            }

            return {
                selectedModuleString,
                selectedModuleOption,
                optionsArray,
                selectModule,
                isLoading,
            };
        },
    };
</script>
