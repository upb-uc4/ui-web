<template>
    <BaseSection title="Research Area" subtitle="This section can be publicly seen.">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="w-full">
                    <label class="input-label-tmp">Research Area</label>
                    <textarea
                        id="researchArea"
                        v-model="myResearchArea"
                        class="w-full"
                        rows="3"
                        :class="errorBag.hasNested('description') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.hasNested('description')" class="input-label-error-tmp">{{
                        errorBag.getNested("description")
                    }}</label>
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="w-full">
                    <label class="input-label-tmp">Description</label>
                    <textarea
                        id="freeText"
                        v-model="myFreeText"
                        class="w-full"
                        rows="5"
                        :class="errorBag.hasNested('freeText') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.hasNested('freeText')" class="input-label-error-tmp">{{ errorBag.getNested("freeText") }}</label>
                </div>
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        name: "ResearchSection",
        components: {
            BaseSection,
        },
        props: {
            freeText: {
                type: String,
                required: true,
            },
            researchArea: {
                type: String,
                required: true,
            },
            errorBag: {
                type: Object as () => ErrorBag,
                required: true,
            },
        },
        emits: ["update:freeText", "update:researchArea"],
        setup(props: any, { emit }: any) {
            return {
                myFreeText: useModelWrapper(props, emit, "freeText"),
                myResearchArea: useModelWrapper(props, emit, "researchArea"),
            };
        },
    };
</script>
