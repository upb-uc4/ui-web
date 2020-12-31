<template>
    <BaseSection subtitle="Restrict participation for this course." title="Restrictions">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label for="maxParticipants" class="input-label-tmp">Participation Limit</label>
                    <input
                        id="maxParticipants"
                        v-model.number="myMaxParticipant"
                        min="0"
                        type="number"
                        class="lg:w-32 w-full"
                        :class="errorBag.has('maxParticipants') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.has('maxParticipants')" for="maxParticipants" class="input-label-warning-tmp">
                        {{ errorBag.get("maxParticipants") }}
                    </label>
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        name: "RestrictionSection",
        components: {
            BaseSection,
        },
        props: {
            maxParticipants: {
                type: Number,
                required: true,
            },
            errorBag: {
                type: Object as () => ErrorBag,
                required: true,
            },
        },
        emits: ["update:maxParticipants"],
        setup(props: any, { emit }: any) {
            return {
                myMaxParticipant: useModelWrapper(props, emit, "maxParticipants"),
            };
        },
    };
</script>
