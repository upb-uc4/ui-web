<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2"> Examination Regulation Information </label>
                <label class="block text-gray-600"> Choose a unique name for the examination regulation </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-4 w-full relative">
                    <label class="text-gray-700 text-md font-medium block mb-4"> Examination Regulation Name </label>
                    <input
                        id="examRegName"
                        v-model.trim="examRegNameInput"
                        class="w-full form-input input-text"
                        placeholder="Exam regulation name"
                    />
                    <div :hidden="examRegNameInput == ''" class="text-gray-700 text-md font-medium my-3">
                        <label v-if="validInput" class="">
                            <i class="text-green-400 fas fa-check mr-2"></i>
                            {{ examRegNameInput }} is available
                        </label>
                        <label v-else class="">
                            <i class="text-red-400 fas fa-times mr-2"></i>
                            Examination regulation {{ examRegNameInput }} already exists!
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import { ref, watch, computed } from "vue";

    export default {
        name: "ExaminationRegulationInformation",
        props: {
            name: {
                type: String,
                default: "",
            },
            valid: {
                type: Boolean,
                default: false,
            },
            examRegs: {
                type: Array,
                required: true,
            },
        },
        emits: ["update:name", "update:valid"],
        setup(props: any, { emit }: any) {
            const usedExamRegNames = props.examRegs as String[];
            let examRegNameInput = ref(props.name);

            let validInput = computed(() => {
                let tmp = !(examRegNameInput.value === "" || usedExamRegNames.find((e) => e == examRegNameInput.value));
                emit("update:valid", tmp);
                return tmp;
            });

            return {
                usedExamRegNames,
                examRegNameInput,
                validInput,
            };
        },
    };
</script>