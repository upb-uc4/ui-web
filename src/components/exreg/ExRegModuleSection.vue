<template>
    <BaseSection title="Modules" subtitle="Add or remove modules to or from the examination regulation.">
        <div class="space-y-12">
            <div class="space-y-4">
                <div class="lg:w-1/2 w-full">
                    <label for="moduleID" class="w-full input-label">Unique Module Identifier</label>
                    <input id="moduleID" v-model="moduleIdentifier" class="w-full input-text" placeholder="e.g. M.1275.78235" />
                    <label v-if="moduleUsed" class="input-label-warning">
                        Module '{{ moduleIdentifier.trim() }}' has already been added.
                    </label>
                </div>
                <div class="lg:w-1/2 w-full">
                    <label for="moduleName" class="w-full input-label">Module Name</label>
                    <input
                        id="moduleName"
                        :value="moduleName"
                        :readonly="moduleExists"
                        class="w-full input-text"
                        placeholder="e.g. Complexity Theory"
                        @input="moduleNameInput = $event.target.value"
                    />
                </div>
                <div class="lg:w-1/2 w-full sm:flex space-y-4 sm:space-y-0 sm:justify-end">
                    <button id="addModule" class="sm:w-32 w-full btn-secondary-add" :disabled="!canAddModule" @click="addModule()">
                        Add Module
                    </button>
                </div>
            </div>
            <div v-if="hasSelectedModules" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <module-card
                    v-for="(module, index) in selectedModules"
                    :key="module.id"
                    :module-identifier="module.id"
                    :module-name="module.name"
                    @remove="removeModule(index)"
                />
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
            const moduleIdentifier = ref("");
            const moduleNameInput = ref("");
            const moduleName = computed(() => {
                const m = props.existingModules.find((m) => m.id == moduleIdentifier.value.trim())?.name;
                return m === undefined ? moduleNameInput.value : m;
            });
            const moduleExists = computed(() => props.existingModules.map((m) => m.id).includes(moduleIdentifier.value.trim()));
            const moduleUsed = computed(() => selectedModules.value.map((m) => m.id).includes(moduleIdentifier.value.trim()));
            const canAddModule = computed(() => moduleIdentifier.value.trim() !== "" && moduleName.value !== "" && !moduleUsed.value);
            const hasSelectedModules = computed(() => selectedModules.value !== undefined && selectedModules.value.length > 0);

            watch(props.modules, () => {
                selectedModules.value = props.modules;
            });

            function addModule() {
                const module = {
                    id: moduleIdentifier.value.trim(),
                    name: moduleName.value.trim(),
                } as Module;

                selectedModules.value.push(module);
                moduleIdentifier.value = "";
                moduleNameInput.value = "";
                emit("update:modules", selectedModules.value);
            }

            function removeModule(index: number) {
                selectedModules.value.splice(index, 1);
            }

            return {
                moduleIdentifier,
                moduleName,
                hasSelectedModules,
                selectedModules,
                moduleExists,
                moduleUsed,
                canAddModule,
                moduleNameInput,
                addModule,
                removeModule,
            };
        },
    };
</script>
