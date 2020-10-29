<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-lg font-medium mb-2">Module Information</label>
                <label class="block text-gray-600"> Modules and examination regulations that the course should be assigned to. </label>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import ErrorBag from "@/use/helpers/ErrorBag";
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
    import { onBeforeMount, ref } from "vue";
    import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";

    export default {
        name: "CourseModulesSection",
        props: {
            errorBag: {
                required: true,
                type: ErrorBag,
            },
            moduleIds: {
                type: Array,
                required: true,
            },
        },
        emits: [],
        setup(props: any, { emit }: any) {
            const examinationRegs = ref([] as ExaminationRegulation[]);
            const selectedExRegs = ref([] as ExaminationRegulation[]);

            onBeforeMount(async () => {
                await getExmatriculationRegs();
            });

            async function getExmatriculationRegs() {
                const examinationRegulationManagement = new ExaminationRegulationManagement();
                const response = await examinationRegulationManagement.getExaminationRegulation();
                const handler = new GenericResponseHandler();
                const result = handler.handleResponse(response);
                if (result) {
                    examinationRegs.value = result;
                    selectedExRegs.value = examinationRegs.value;
                }
            }
            return { examinationRegs };
        },
    };
</script>
