<template>
    <BaseSection title="Basics" subtitle="Choose a unique name for the examination regulation.">
        <div class="lg:w-1/2 w-full">
            <label for="examRegName" class="input-label-tmp">Examination Regulation Name</label>
            <input
                id="examRegName"
                v-model.trim="newName"
                class="w-full"
                :class="valid || !newName ? 'input-text-tmp' : 'input-text-error-tmp'"
            />
            <div v-if="newName !== ''" id="examRegNameFeedback">
                <label v-if="!valid" class="input-label-error-tmp"> '{{ newName }}' already exists! </label>
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import { watch } from "vue";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        name: "ExaminationRegulationInformation",
        components: {
            BaseSection,
        },
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
            errorBag: {
                type: Object as () => ErrorBag,
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
