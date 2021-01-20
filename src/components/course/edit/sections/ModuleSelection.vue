<template>
    <div class="p-4 rounded-md border-2 border-gray-200 dark:border-normalgray-700">
        <div class="space-y-4">
            <tag-list
                v-if="selectedModules.length > 0"
                :elements="selectedModules"
                property-to-display="display"
                @on-remove="removeModule"
            />
            <span v-else class="input-label-warning">Please select at least one module.</span>
            <searchable-select
                v-model:selected="selectedModule"
                placeholder="Search modules"
                :elements="availableModules"
                :clear-input-on-select="true"
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

    export default {
        name: "ModuleSelection",
        props: {
            examinationRegulation: {
                type: Object as () => ExaminationRegulation,
                required: true,
            },
            selectedModuleIds: {
                type: Object as () => Set<String>,
                required: true,
            },
        },
        components: {
            TagList,
            SearchableSelect,
        },
        emits: ["add-module", "remove-module"],
        setup(props: any, { emit }: any) {
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
            const selectedModules = computed(() =>
                modules.value.filter((option: SearchSelectOption) => {
                    const module = option.value as Module;
                    return props.selectedModuleIds.has(module.id);
                })
            );
            const availableModules = computed(() =>
                modules.value.filter((option: SearchSelectOption) => {
                    const module = option.value as Module;
                    return !props.selectedModuleIds.has(module.id);
                })
            );

            const selectedModule = ref({} as SearchSelectOption);

            function removeModule(index: number) {
                const module = selectedModules.value[index]; //cannot get this from splice as we use splice on proxy.
                emit("remove-module", module.value);
            }

            function addModule(module: SearchSelectOption) {
                emit("add-module", module.value);
            }

            return { availableModules, selectedModule, selectedModules, removeModule, addModule };
        },
    };
</script>
