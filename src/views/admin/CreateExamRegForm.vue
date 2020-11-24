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
            <ExRegInfoSection v-model:name="examRegName" v-model:valid="nameValid" :exam-regs="existingExamRegNames" />
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
    import { ref, computed, onBeforeMount } from "vue";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";
    import Router from "@/use/router";
    import Module from "@/api/api_models/exam_reg_management/Module";
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
    import ExRegInfoSection from "@/components/exreg/ExRegInfoSection.vue";
    import ExRegModuleSection from "@/components/exreg/ExRegModuleSection.vue";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";

    export default {
        name: "CreateExamRegForm",
        components: {
            ExRegModuleSection,
            UnsavedChangesModal,
            ExRegInfoSection,
            LoadingComponent,
        },
        setup: function () {
            const heading = "Create Examination Regulation";
            const examRegName = ref("");

            const busy = ref(false); // for later use
            const examApi = new ExaminationRegulationManagement();
            const responseHandler = new GenericResponseHandler("Examination Regulation Data");

            const existingExamRegNames = ref([] as string[]);
            const selectedModules = ref([] as Module[]);
            const existingModules = ref([] as Module[]);

            onBeforeMount(async () => {
                busy.value = true;
                await Promise.all([getModules(), getExamRegNames()]);
                busy.value = false;
            });

            async function getExamRegNames() {
                let namesResponse = await examApi.getExaminationRegulationNames();
                existingExamRegNames.value = responseHandler.handleResponse(namesResponse);
            }

            async function getModules() {
                let moduleResponse = await examApi.getModules();
                existingModules.value = responseHandler.handleResponse(moduleResponse);
            }

            const canCreate = computed(() => selectedModules.value.length > 0 && nameValid);

            function back() {
                Router.push("/all-courses");
            }

            async function createExamReg() {
                if (!canCreate.value) {
                    return;
                }
                let examReg: ExaminationRegulation;
                examReg = {
                    name: examRegName.value,
                    active: true,
                    modules: selectedModules.value,
                };
                busy.value = true;
                let response = await examApi.createExaminationRegulation(examReg);
                let handledResponse = responseHandler.handleResponse(response);
                busy.value = false;
            }

            const nameValid = computed(() => !(examRegName.value === "" || existingExamRegNames.value.find((e) => e == examRegName.value)));

            return {
                busy,
                existingModules,
                examRegName,
                existingExamRegNames,
                heading,
                selectedModules,
                canCreate,
                back,
                createExamReg,
                nameValid,
            };
        },
    };
</script>
