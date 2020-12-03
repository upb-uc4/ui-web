<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2"> Modules </label>
                <label class="block text-gray-600"> Add modules to the examination regulation.</label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-8 w-full relative">
                    <div class="mb-4">
                        <label for="moduleID" class="text-gray-700 text-md font-medium block mb-3"> Choose Module ID </label>
                        <input id="moduleID" v-model.trim="moduleID" class="w-full form-input input-text" placeholder="Module ID" />
                    </div>
                    <div v-if="moduleID !== '' && !moduleUsed && !moduleExists" class="mb-4">
                        <label for="moduleName" class="text-gray-700 text-md font-medium block mb-3"> Choose Module Name </label>
                        <input
                            id="moduleName"
                            v-model.trim="moduleNameInput"
                            class="w-full form-input input-text"
                            placeholder="Module Name"
                        />
                    </div>
                    <div v-else-if="moduleUsed" class="mb-4">
                        <label class="text-gray-700 text-md font-medium my-3">
                            <i class="text-red-400 fas fa-times mr-2"></i>
                            Module {{ moduleID }} already selected!
                        </label>
                    </div>
                    <div v-if="moduleID !== '' && moduleName !== '' && !moduleUsed">
                        <div class="mb-4 p-3 bg-gray-100 rounded">
                            <div class="relative">
                                <label class="block text-gray-700 text-md font-medium mb-1">
                                    {{ moduleID }}
                                </label>
                                <label class="block text-gray-600">
                                    {{ moduleName }}
                                </label>
                                <div class="absolute inset-y-0 right-0">
                                    <div class="hidden sm:flex">
                                        <button id="addModule" class="btn btn-green-secondary w-48" @click="addCurrentModule">
                                            {{ moduleExists ? "Add Module" : "Create Module" }}
                                        </button>
                                    </div>
                                    <div class="sm:hidden">
                                        <button class="btn btn-icon-green ml-3 text-xl w-12 h-12" @click="addCurrentModule">
                                            <i class="fas fa-plus text-md" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-4 w-full">
                    <div v-for="(module, index) in selectedModules" :key="module.id">
                        <div class="mb-4 p-3 bg-gray-100 rounded-lg shadow-sm flex w-full">
                            <div class="w-full flex flex-col">
                                <label class="block text-gray-700 text-md font-medium mb-1">
                                    {{ module.id }}
                                </label>
                                <label class="block text-gray-600">
                                    {{ module.name }}
                                </label>
                            </div>
                            <div class="w-full flex justify-end">
                                <div class="hidden sm:flex">
                                    <button :id="'removeModule' + index" class="w-48 btn btn-red-secondary" @click="removeModule(index)">
                                        Remove Module
                                    </button>
                                </div>
                                <div class="sm:hidden">
                                    <button class="btn btn-icon-red ml-3 text-xl w-12 h-12" @click="removeModule(index)">
                                        <i class="fas fa-trash text-md" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { watch, ref, computed } from "vue";
    import Module from "@/api/api_models/exam_reg_management/Module";

    export default {
        name: "ExRegModuleSection",
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
                    console.log("watch triggered");
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
