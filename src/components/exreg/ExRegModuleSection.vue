<template>
    <BaseSection title="Modules" subtitle="Add modules to the examination regulation.">
        <div class="space-y-4">
            <div class="lg:w-1/2 w-full">
                <label for="moduleID" class="w-full input-label-tmp"> Choose Module ID </label>
                <input id="moduleID" v-model.trim="moduleID" class="w-full input-text-tmp" placeholder="Module ID" />
                <label v-if="moduleUsed" class="input-label-error-tmp"> Module '{{ moduleID }}' already selected! </label>
            </div>
            <div v-if="moduleID !== '' && !moduleUsed && !moduleExists" class="lg:w-1/2 w-full">
                <label for="moduleName" class="w-full input-label-tmp"> Choose Module Name </label>
                <input id="moduleName" v-model.trim="moduleNameInput" class="w-full input-text-tmp" placeholder="Module Name" />
            </div>
            <div v-if="moduleID !== '' && moduleName !== '' && !moduleUsed">
                <div class="w-full rounded-md border-gray-200 dark:border-normal gray-700 border h-24 p-4 mx-auto md:mx-0">
                    <div class="relative">
                        <div class="font-medium text-lg dark:text-gray-300">{{ moduleID }}</div>
                        <div class="text-sm text-gray-700 dark:text-gray-500">{{ moduleName }}</div>
                        <div class="absolute inset-y-0 right-0">
                            <button id="addModule" class="btn-secondary-add-tmp" @click="addCurrentModule">
                                {{ moduleExists ? "Add Module" : "Create Module" }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="selectedModules !== 'undefined' && selectedModules.length > 0" class="pb-4 pt-4">
                <hr />
            </div>
            <div v-if="selectedModules !== 'undefined' && selectedModules.length > 0">
                <label class="input-label-tmp">Selected Modules</label>
                <div v-if="selectedModules !== 'undefined' && selectedModules.length > 0" class="mb-4 w-full flex flex-wrap">
                    <div v-for="(module, index) in selectedModules" :key="module.id" class="pr-4 pb-4">
                        <module-card :module-id="module.id" :module-name="module.name" @remove="removeModule(index)" />
                    </div>
                </div>
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import { watch, ref, computed } from "vue";
    import Module from "@/api/api_models/exam_reg_management/Module";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import ModuleCard from "@/components/exreg/ModuleCard.vue";

    export default {
        name: "ExRegModuleSection",
        components: {
            BaseSection,
            ModuleCard,
        },
        props: {
            existingModules: {
                type: Array,
                required: true,
            },
            modules: {
                type: Array,
                required: true,
            },
        },
        emits: ["update:modules"],
        setup: (props: { existingModules: Module[]; modules: Module[] }, { emit }: any) => {
            const selectedModules = ref(props.modules as Module[]);
            const moduleID = ref("");
            const moduleNameInput = ref("");
            const moduleExists = computed(() => props.existingModules.map((m) => m.id).includes(moduleID.value));
            const moduleUsed = computed(() => selectedModules.value.map((m) => m.id).includes(moduleID.value));
            const moduleName = computed(() => {
                if (moduleExists.value) {
                    return props.existingModules.filter((m) => m.id === moduleID.value)[0].name;
                } else {
                    return moduleNameInput.value;
                }
            });

            function addCurrentModule() {
                const module = {
                    id: moduleID.value,
                    name: moduleName.value,
                } as Module;
                selectedModules.value.unshift(module);
                moduleID.value = "";
                moduleNameInput.value = "";
                emit("update:modules", selectedModules.value);
            }

            watch(
                () => props.modules,
                () => {
                    selectedModules.value = props.modules;
                }
            );

            function removeModule(index: number) {
                selectedModules.value.splice(index, 1);
            }

            return {
                moduleID,
                selectedModules,
                moduleExists,
                moduleUsed,
                moduleName,
                moduleNameInput,
                addCurrentModule,
                removeModule,
            };
        },
    };
</script>
