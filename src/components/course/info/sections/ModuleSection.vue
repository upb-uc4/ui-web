<template>
    <base-section id="moduleSection" title="Module Information" subtitle="Select the module that this course should count to.">
        <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
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

    export default {
        name: "CourseModulesSection",
        components: {
            SearchableSelect,
            BaseSection,
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
            let optionsArray = ref([] as SearchSelectOption[]);
            let selectedModuleString = ref(props.selected);
            let selectedModuleOption = ref({} as SearchSelectOption);

            onBeforeMount(async () => {
                if (!props.registered) await getModules();
            });

            function selectModule(module: SearchSelectOption) {
                let emitValue = (module.value as Module).id;
                emitValue == undefined ? emit("update:selected", "") : emit("update:selected", emitValue);
            }

            async function getModules() {
                (props.moduleIds as string[]).forEach((s) => {
                    //TODO get module names via API
                    optionsArray.value.push({ value: { id: s, name: s } as Module, display: s });
                });
            }

            return {
                selectedModuleString,
                selectedModuleOption,
                optionsArray,
                selectModule,
            };
        },
    };
</script>
