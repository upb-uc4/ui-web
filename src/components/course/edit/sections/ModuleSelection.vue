<template>
    <div class="p-4 rounded-md border-2 border-gray-200 dark:border-normalgray-700">
        <div class="space-y-4">
            <tag-list :elements="selectedModules" property-to-display="display" @on-remove="removeModule" />
            <span class="hidden input-label-warning">Please select at least one module.</span>
            <searchable-select
                v-model:selected="selectedModule"
                placeholder="Search modules"
                :elements="availableModules"
                @update:selected="addModule"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";
    import TagList from "@/components/common/TagList.vue";
    import { computed, ref } from "vue";
    import SearchableSelect from "@/components/common/SearchableSelect.vue";
    import Module from "@/api/api_models/exam_reg_management/Module";
    import __ from "lodash";

    export default {
        name: "ModuleSelection",
        props: {
            examinationRegulation: {
                type: Object as () => ExaminationRegulation,
                required: true,
            },
        },
        components: {
            TagList,
            SearchableSelect,
        },
        setup(props: any) {
            const modules = computed(() => {
                let selectableModules: SearchSelectOption[] = [];
                props.examinationRegulation.modules.forEach((module: Module) => {
                    const option = {
                        value: module,
                        display: module.name,
                    };
                    selectableModules.push(option);
                });
                return selectableModules;
            });
            const availableModules = ref(__.cloneDeep(modules.value) as SearchSelectOption[]); //use modules initially
            const selectedModules = ref([] as SearchSelectOption[]);
            const selectedModule = ref({} as SearchSelectOption);

            function removeModule(index: number) {
                const module = selectedModules.value[index]; //cannot get this from splice as we use splice on proxy.
                availableModules.value.push(module);
                selectedModules.value.splice(index, 1);
            }

            function addModule(module: SearchSelectOption) {
                availableModules.value = availableModules.value.filter((module) => {
                    //first ".value" for ref, second ".value" for SearchableSelectOption.value
                    return module.value !== selectedModule.value.value;
                });
                selectedModules.value.push(module);
                selectedModule.value = {} as SearchSelectOption;
            }

            return { availableModules, selectedModule, selectedModules, removeModule, addModule };
        },
    };
</script>
