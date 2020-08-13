<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2">Restrictions</label>
                <label class="block text-gray-600">
                    This is some long detailed description which is part towards a better form.
                </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Participation Limit</label>
                    <input
                        id="maxParticipants"
                        v-model.number="maxParticipants"
                        type="number"
                        min="0"
                        max="999"
                        class="w-full form-input input-text"
                        :class="{ error: errorBag.has('maxParticipants') }"
                        @change="updateLimit($event.target.value)"
                    />
                    <p v-if="errorBag.has('maxParticipants')" class="error-message">
                        {{ errorBag.get("maxParticipants") }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import ErrorBag from "@/use/ErrorBag";
    import { useModelWrapper } from "@/use/ModelWrapper";
    import { ref } from "vue";

    export default {
        name: "RestrictionsSection",
        props: {
            errorBag: {
                required: true,
                type: ErrorBag,
            },
            participantsLimit: {
                required: true,
                type: Number,
            },
        },
        emits: ["update:participantsLimit"],
        setup(props: any, { emit }: any) {
            let maxParticipants = ref(props.participantsLimit);

            function updateLimit(value: any) {
                if (/[0-9]{1,3}/g.test(value)) {
                    emit("update:participantsLimit", parseInt(value));
                } else {
                    emit("update:participantsLimit", 0);
                    maxParticipants.value = 0;
                }
            }
            return {
                maxParticipants,
                updateLimit,
            };
        },
    };
</script>
