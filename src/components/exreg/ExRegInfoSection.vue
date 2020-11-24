<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2"> Examination Regulation Information </label>
                <label class="block text-gray-600"> Choose a unique name for the examination regulation </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-4 w-full relative">
                    <label for="examRegName" class="text-gray-700 text-md font-medium block mb-4"> Examination Regulation Name </label>
                    <input
                        id="examRegName"
                        v-model.trim="newName"
                        class="w-full form-input input-text"
                        placeholder="Exam regulation name"
                    />
                    <div v-if="newName !== ''" class="text-gray-700 text-md font-medium my-3">
                        <label v-if="valid" class="">
                            <i class="text-green-400 fas fa-check mr-2"></i>
                            {{ newName }} is available
                        </label>
                        <label v-else class="">
                            <i class="text-red-400 fas fa-times mr-2"></i>
                            Examination regulation {{ newName }} already exists!
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import { watch } from "vue";

    export default {
        name: "ExaminationRegulationInformation",
        props: {
            existingNames: {
                type: Array,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            valid: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["update:name", "update:valid"],
        setup(props: { existingNames: string[]; name: string; valid: boolean }, { emit }: any) {
            watch(
                () => props.name,
                () => emit("update:valid", !(props.name === "" || props.existingNames.find((e) => e == props.name)))
            );

            return {
                newName: useModelWrapper(props, emit, "name"),
            };
        },
    };
</script>
