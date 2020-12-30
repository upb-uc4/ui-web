<template>
    <base-section title="Time" subtitle="information about Start and End Dates of the Course as well as Slot Times.">
        <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
            <div class="lg:w-1/2 w-full">
                <label class="input-label-tmp">Start Date</label>
                <birth-date-input v-model:birth-date="startDate" :disabled="true" />
                <label v-if="errorBag.has('startDate')" class="input-label-warning-tmp">{{ errorBag.get("startDate") }}</label>
            </div>
            <div class="lg:w-1/2 w-full">
                <label class="input-label-tmp">End Date</label>
                <birth-date-input v-model:birth-date="endDate" :disabled="true" />
                <label v-if="errorBag.has('endDate')" class="input-label-warning-tmp">{{ errorBag.get("endDate") }}</label>
            </div>
        </div>
    </base-section>
</template>

<script lang="ts">
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import BirthDateInput from "@/components/account/edit/BirthDateInput.vue";

    export default {
        name: "RestrictionsSection",
        components: {
            BaseSection,
            BirthDateInput,
        },
        props: {
            errorBag: {
                required: true,
                type: ErrorBag,
            },
            start: {
                required: true,
                type: String,
            },
            end: {
                required: true,
                type: String,
            },
        },
        emits: ["update:start", "update:end"],
        setup(props: any, { emit }: any) {
            return {
                startDate: useModelWrapper(props, emit, "start"),
                endDate: useModelWrapper(props, emit, "end"),
            };
        },
    };
</script>
