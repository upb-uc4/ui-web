<template>
    <BaseSection
        title="Personal Information"
        subtitle="You may not update this information on your own. In case some of your personal information has changed, please contact our support staff."
    >
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">First Name</label>
                    <base-input
                        v-model:value="myFirstName"
                        :error-message="errorBag.getNested('firstName')"
                        identifier="firstName"
                        type="text"
                        :readonly="readonly"
                        placeholder="Firstname"
                        class="w-full"
                        validation-query="user.firstName"
                    />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Last Name</label>
                    <base-input
                        v-model:value="myLastName"
                        :error-message="errorBag.getNested('lastName')"
                        identifier="lastName"
                        type="text"
                        :readonly="readonly"
                        placeholder="Lastname"
                        class="w-full"
                        validation-query="user.lastName"
                    />
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Date of Birth</label>
                    <date-picker v-model:date="myBirthDate" :disabled="readonly" />
                    <label v-if="errorBag.hasNested('birthDate')" class="input-label-error">{{ errorBag.getNested("birthDate") }}</label>
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseInput from "@/components/common/BaseInput.vue";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import DatePicker from "@/components/common/DatePicker.vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        name: "PersonalSection",
        components: {
            BaseInput,
            BaseSection,
            DatePicker,
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
