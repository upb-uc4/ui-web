<template>
    <base-section title="Restrictions" subtitle="All restrictions that apply to this course.">
        <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
            <div class="lg:w-1/2 w-full">
                <label class="input-label">Participants</label>
                <input class="input-text w-full" readonly :value="`${currentParticipants} / ${participantsLimit}`" />
                <span v-if="full" class="input-label-error">Course is full.</span>
            </div>
            <div class="lg:w-1/2 w-full invisible" />
        </div>
    </base-section>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";

    export default {
        name: "ParticipantsSection",
        components: {
            BaseSection,
        },
        props: {
            participantsLimit: {
                required: true,
                type: Number,
            },
            currentParticipants: {
                required: true,
                type: Number,
            },
            full: {
                type: Boolean,
                required: true,
            },
        },
    };
</script>
