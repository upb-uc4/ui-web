<template>
    <BaseSection subtitle="Information of Participation Restrictions for the Course" title="Restrictions">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Participation Limit</label>
                    <base-input
                        v-model:value="myMaxParticipants"
                        identifier="maxParticipants"
                        type="number"
                        class="w-full"
                        :error-message="getErrorMessage(errorBag, 'maxParticipants')"
                        validation-query="course.maxParticipants"
                        @input="updateLimit($event.target.value)"
                    />
                </div>
                <div class="lg:w-1/2 w-full" />
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseInput from "@/components/common/BaseInput.vue";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import ErrorBag, { getErrorMessage } from "@/use/helpers/ErrorBag";
    import { ref } from "vue";

    export default {
        name: "RestrictionSection",
        components: {
            BaseSection,
            BaseInput,
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
            let myMaxParticipants = ref(props.maxParticipants.toString());

            function isNumber(value: string) {
                return /[0-9]/g.test(value);
            }

            function updateLimit(value: string) {
                if (isNumber(value)) {
                    emit("update:maxParticipants", parseInt(value));
                } else {
                    emit("update:maxParticipants", 0);
                }
            }

            return {
                myMaxParticipants,
                updateLimit,
                getErrorMessage,
            };
        },
    };
</script>
