<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2"> Modules </label>
                <label class="block text-gray-600"> Add modules to the examination regulation </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-8 w-full relative">
                    <div class="mb-4">
                        <label class="text-gray-700 text-md font-medium block mb-3"> Choose Module ID </label>
                        <input id="moduleID" v-model.trim="moduleID" class="w-full form-input input-text" placeholder="Module ID" />
                    </div>
                    <div v-if="moduleID !== '' && !moduleUsed && !moduleExists" class="mb-4">
                        <label class="text-gray-700 text-md font-medium block mb-3"> Choose Module Name </label>
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
                    <div :hidden="moduleID === '' || moduleName === '' || moduleUsed">
                        <div class="mb-4 p-3 bg-gray-100 rounded">
                            <div class="relative">
                                <label class="block text-gray-700 text-md font-medium mb-1">
                                    {{ moduleID }}
                                </label>
                                <label class="block text-gray-600">
                                    {{ moduleName }}
                                </label>
                                <div class="absolute inset-y-0 right-0">
                                    <button
                                        class="btn bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                                        @click="addCurrentModule"
                                    >
                                        <div v-if="moduleExists">Add Module</div>
                                        <div v-else>Create Module</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-4 w-full">
                    <div v-for="(module, index) in selectedModules" :key="module.id">
                        <div class="mb-4 p-3 bg-gray-100 rounded flex w-full">
                            <div class="w-full flex flex-col">
                                <label class="block text-gray-700 text-md font-medium mb-1">
                                    {{ module.id }}
                                </label>
                                <label class="block text-gray-600">
                                    {{ module.name }}
                                </label>
                            </div>
                            <div class="w-full flex justify-end">
                                <button class="btn btn-icon-red ml-3 text-xl w-12 h-12" @click="removeModule(index)">
                                    <i class="fas fa-trash text-md"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { ref, computed } from "vue";
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
        setup: (props: any, { emit }: any) => {
            const existingModules = props.existingModules as Module[];
            let selectedModules = ref(props.modules as Module[]);
            let moduleID = ref("");
            let moduleNameInput = ref("");
            let moduleExists = computed(() => existingModules.map((m) => m.id).includes(moduleID.value));
            let moduleUsed = computed(() => selectedModules.value.map((m) => m.id).includes(moduleID.value));
            let moduleName = computed(() => {
                if (moduleExists.value) {
                    return existingModules.filter((m) => m.id === moduleID.value)[0].name;
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
                emit("update:modules", selectedModules);
            }

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
