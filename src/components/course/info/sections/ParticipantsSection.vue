<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2">Participants</label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Participation</label>
                    <input
                        id="participants"
                        :value="`${currentParticipants}/${participantsLimit}`"
                        type="text"
                        disabled
                        class="w-full form-input input-text"
                    />
                    <div v-if="full" class="text-red-500 flex items-baseline">
                        <i class="inline text-lg fas fa-times-circle mr-2" />
                        course full
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import { ref } from "vue";

    export default {
        name: "ParticipantsSection",
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
