<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2">Restrictions</label>
                <label class="block text-gray-600"> Information of Participation Restrictions for the Course </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Participation Limit</label>
                    <base-input
                        v-model:value="maxParticipants"
                        identifier="maxParticipants"
                        type="number"
                        class="w-full"
                        :error-message="getErrorMessage(errorBag, 'maxParticipants')"
                        validation-query="course.maxParticipants"
                        @input="updateLimit($event.target.value)"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import ErrorBag, { getErrorMessage } from "@/use/helpers/ErrorBag";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import { ref } from "vue";
    import BaseInput from "@/components/common/BaseInput.vue";

    export default {
        name: "RestrictionsSection",
        components: {
            BaseInput,
        },
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

            function isNumber(value: string) {
                return /[0-9]/g.test(value);
            }

            function updateLimit(value: string) {
                if (isNumber(value)) {
                    emit("update:participantsLimit", parseInt(value));
                } else {
                    emit("update:participantsLimit", 0);
                }
            }

            return {
                maxParticipants,
                updateLimit,
                getErrorMessage,
            };
        },
    };
</script>
