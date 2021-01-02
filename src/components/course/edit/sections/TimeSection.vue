<template>
    <base-section title="Time" subtitle="Manage dates as well as time slots.">
        <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
            <div class="lg:w-1/2 w-full">
                <label class="input-label-tmp">Start Date</label>
                <input id="startDate" class="input-text-tmp w-full" readonly type="text" :value="start" />
            </div>
            <div class="lg:w-1/2 w-full">
                <label class="input-label-tmp">End Date</label>
                <input id="endDate" class="input-text-tmp w-full" readonly type="text" :value="end" />
            </div>
        </div>
    </base-section>
</template>

<script lang="ts">
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import BaseSection from "@/components/common/section/BaseSection.vue";

    export default {
        name: "TimeSection",
        components: {
            BaseSection,
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
