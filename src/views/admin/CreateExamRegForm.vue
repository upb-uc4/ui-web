<template>
    <div v-if="busy" class="flex h-screen">
        <div class="m-auto">
            <loading-component />
        </div>
    </div>
    <div v-else class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button class="flex items-center mb-4 navigation-link" @click="back">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>
        <h1 class="text-2xl font-medium text-gray-700 mb-8">{{ heading }}</h1>
        <div>
            <ExRegInfoSection v-model:name="examRegName" v-model:valid="examRegNameValid" :exam-regs="existingExamRegNames" />
            <ExRegModuleSection v-model:modules="selectedModules" :existing-modules="existingModules" />
            <section class="border-t-2 py-8 border-gray-400 lg:mt-8">
                <div class="hidden sm:flex justify-between">
                    <div class="flex justify-end items-center">
                        <button id="cancel" type="button" class="w-32 mr-6 btn btn-blue-secondary" @click="back">Cancel</button>
                        <button
                            id="createExamReg"
                            :disabled="!canCreate"
                            style="width: 18rem"
                            class="btn btn-blue-primary"
                            @click="createExamReg"
                        >
                            Create Examination Regulation
                        </button>
                    </div>
                </div>

                <!-- different button layout for mobile -->
                <div class="sm:hidden">
                    <button id="mobileCancel" type="button" class="mb-4 w-full btn btn-blue-secondary" @click="back">Cancel</button>
                    <button id="mobileCreateCourse" :disabled="!canCreate" class="mb-4 w-full btn btn-blue-primary" @click="createExamReg">
                        Create Examination Regulation
                    </button>
                </div>
            </section>
            <unsaved-changes-modal ref="unsavedChangesModal" />
        </div>
    </div>
</template>

<script lang="ts">
    import { ref, computed } from "vue";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";
    import Router from "@/use/router";
    import Module from "@/api/api_models/exam_reg_management/Module";
    import ExRegInfoSection from "@/components/exreg/ExRegInfoSection.vue";
    import ExRegModuleSection from "@/components/exreg/ExRegModuleSection.vue";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";

    export default {
        name: "CreateExamRegForm",
        components: {
            ExRegModuleSection,
            UnsavedChangesModal,
            ExRegInfoSection,
            LoadingComponent,
        },
        props: {
            name: {
                type: String,
                default: "",
                required: false,
            },
        },
        setup: function () {
            const heading = "Create Examination Regulation";
            const examRegName = ref("");
            const examRegNameValid = ref(false);
            const busy = ref(false); // for later use
            const existingExamRegNames = [
                "Informatik Bachelor v1",
                "Informatik Bachelor v2",
                "Informatik Master v1",
                "Informatik Master v1.1",
                "Informatik Master v1.2",
            ];
            const selectedModules = ref([
                {
                    id: "M100",
                    name: "Algorithms",
                },
                {
                    id: "M101",
                    name: "IT Security",
                },
                {
                    id: "M201",
                    name: "Complexity",
                },
            ] as Module[]);

            const existingModules = ref([
                {
                    id: "M300",
                    name: "Algorithms",
                },
                {
                    id: "M201",
                    name: "Complexity",
                },
            ] as Module[]);

            const canCreate = computed(() => selectedModules.value.length > 0 && examRegNameValid.value);

            function back() {
                Router.push("/all-courses");
            }

            function createExamReg() {
                return;
            }

            return {
                busy,
                existingModules,
                examRegName,
                examRegNameValid,
                existingExamRegNames,
                heading,
                selectedModules,
                canCreate,
                back,
                createExamReg,
            };
        },
    };
</script>
