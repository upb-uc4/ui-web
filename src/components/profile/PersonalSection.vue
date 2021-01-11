<template>
    <BaseSection
        title="Personal Information"
        subtitle="You may not update this information on your own. In case some of your personal information has changed, please contact our support staff."
    >
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">First Name</label>
                    <input
                        id="firstName"
                        v-model="myFirstName"
                        type="text"
                        :readonly="readonly"
                        class="w-full input-text"
                        :class="errorBag.hasNested('firstName') ? 'input-text-error' : 'input-text'"
                    />
                    <label v-if="errorBag.hasNested('firstName')" class="input-label-error">{{ errorBag.getNested("firstName") }}</label>
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Last Name</label>
                    <input
                        id="lastName"
                        v-model="myLastName"
                        type="text"
                        :readonly="readonly"
                        class="w-full input-text"
                        :class="errorBag.hasNested('lastName') ? 'input-text-error' : 'input-text'"
                    />
                    <label v-if="errorBag.hasNested('lastName')" class="input-label-error">{{ errorBag.getNested("lastName") }}</label>
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <birth-date-input v-model:birth-date="myBirthDate" :disabled="readonly" />
                    <label v-if="errorBag.hasNested('birthDate')" class="input-label-error">{{ errorBag.getNested("birthDate") }}</label>
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import BirthDateInput from "@/components/account/edit/BirthDateInput.vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        name: "PersonalSection",
        components: {
            BaseSection,
            BirthDateInput,
        },
        props: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            birthDate: {
                type: String,
                required: true,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            errorBag: {
                type: Object as () => ErrorBag,
                required: true,
            },
        },
        emits: ["update:firstName", "update:lastName", "update:birthDate"],
        setup(props: any, { emit }: any) {
            return {
                myFirstName: useModelWrapper(props, emit, "firstName"),
                myLastName: useModelWrapper(props, emit, "lastName"),
                myBirthDate: useModelWrapper(props, emit, "birthDate"),
            };
        },
    };
</script>
