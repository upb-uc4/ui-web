<template>
    <BaseSection title="Date Information" subtitle="The deadlines that the exam should be assigned to">
        <div class="lg:w-1/2">
            <ISODatePicker v-model:iso-date="myAdmitUntilDate" :disabled="viewMode" title="Admittable Until" />
            <label v-if="errorBag?.has('admittableUntil')" class="input-label-error">
                {{ errorBag.get("admittableUntil") }}
            </label>
        </div>
        <div class="lg:w-1/2 mt-5">
            <ISODatePicker v-model:iso-date="myDropUntilDate" :disabled="viewMode" title="Droppable Until" />
            <label v-if="errorBag?.has('droppableUntil')" class="input-label-error">
                {{ errorBag.get("droppableUntil") }}
            </label>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import ISODatePicker from "@/components/common/ISODatePicker.vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";

    export default {
        name: "ExamDatesSection",
        components: {
            BaseSection,
            ISODatePicker,
        },
        props: {
            errorBag: {
                required: true,
                type: ErrorBag,
            },
            admitUntilDate: {
                type: String,
                required: true,
            },
            dropUntilDate: {
                type: String,
                required: true,
            },
            viewMode: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["update:admitUntilDate", "update:dropUntilDate"],
        setup(props: any, { emit }: any) {
            return {
                myAdmitUntilDate: useModelWrapper(props, emit, "admitUntilDate"),
                myDropUntilDate: useModelWrapper(props, emit, "dropUntilDate"),
            };
        },
    };
</script>
