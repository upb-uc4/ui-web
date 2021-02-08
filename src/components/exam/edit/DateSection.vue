<template>
    <BaseSection title="Date Information" subtitle="The actual exam date and deadlines that the exam should be assigned to">
        <div class="lg:w-1/2">
            <ISODatePicker v-model:iso-date="myExamDate" :disabled="viewMode" title="Exam Date" />
        </div>
        <div class="lg:w-1/2 mt-12">
            <ISODatePicker v-model:iso-date="myAdmitUntilDate" :disabled="viewMode" title="Admittable Until" />
        </div>
        <div class="lg:w-1/2 mt-5">
            <ISODatePicker v-model:iso-date="myDropUntilDate" :disabled="viewMode" title="Droppable Until" />
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { ref } from "vue";
    import ISODatePicker from "@/components/common/ISODatePicker.vue";

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
            examDate: {
                type: String,
                required: true,
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
        emits: ["update-exam-date", "update-admit-until-date", "update-drop-until-date"],
        setup(props: any, { emit }: any) {
            const myExamDate = ref(props.examDate);
            const myAdmitUntilDate = ref(props.admitUntilDate);
            const myDropUntilDate = ref(props.dropUntilDate);
            return {
                myExamDate,
                myAdmitUntilDate,
                myDropUntilDate,
            };
        },
    };
</script>
