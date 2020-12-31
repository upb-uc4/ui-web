<template>
    <base-view>
        <loading-spinner v-if="busy" />
        <div v-else>
            <section-header title="Create Examinination Regulation" />
            <ExRegInfoSection
                v-model:name="examRegName"
                v-model:valid="nameValid"
                :existing-names="existingExamRegNames"
                :error-bag="errorBag"
            />
            <ExRegModuleSection v-model:modules="selectedModules" :existing-modules="existingModules" :error-bag="errorBag" />
            <button-section>
                <template #right>
                    <button id="cancel" type="button" class="btn-secondary-tmp w-full sm:w-48" @click="back">Cancel</button>
                    <button id="createExamReg" :disabled="!canCreate" class="btn-tmp w-full sm:w-48" @click="createExamReg">Create</button>
                </template>
            </button-section>
        </div>
    </base-view>
    <unsaved-changes-modal ref="unsavedChangesModal" />
</template>

<script lang="ts">
    import { ref, computed, onBeforeMount } from "vue";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";
    import Router from "@/use/router";
    import Module from "@/api/api_models/exam_reg_management/Module";
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
    import ExRegInfoSection from "@/components/exreg/ExRegInfoSection.vue";
    import ExRegModuleSection from "@/components/exreg/ExRegModuleSection.vue";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import ValidationResponseHandler from "@/use/helpers/ValidationResponseHandler";
    import { useToast } from "@/toast";
    import BaseView from "@/views/common/BaseView.vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import SectionHeader from "@/components/common/section/SectionHeader.vue";

    export default {
        name: "CreateExamRegForm",
        components: {
            ExRegModuleSection,
            UnsavedChangesModal,
            ExRegInfoSection,
            BaseView,
            LoadingSpinner,
            ButtonSection,
            SectionHeader,
        },
        setup() {
            const errorBag = ref(new ErrorBag());
            const heading = "Create Exam Regulation";
            const examRegName = ref("");
            const nameValid = ref(false);

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

            const canCreate = computed(() => selectedModules.value.length > 0 && nameValid.value);

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
                const response = await examApi.createExaminationRegulation(examReg);
                const validationResponseHandler = new ValidationResponseHandler("examination regulation");
                const handledResponse = validationResponseHandler.handleResponse(response);
                if (handledResponse) {
                    const toast = useToast();
                    toast.success(`Examination regulation ${examRegName.value} created.`);
                    // reset ui, add new exam regs and modules since blockchain is lazy...
                    existingExamRegNames.value.push(examRegName.value);
                    let newModules = selectedModules.value.filter((m) => !existingModules.value.find((x) => m == x));
                    existingModules.value.push(...newModules);
                    selectedModules.value = [] as Module[];
                    examRegName.value = "";
                }
                busy.value = false;
            }

            return {
                busy,
                existingModules,
                examRegName,
                existingExamRegNames,
                heading,
                selectedModules,
                canCreate,
                nameValid,
                errorBag,
                back,
                createExamReg,
            };
        },
    };
</script>
