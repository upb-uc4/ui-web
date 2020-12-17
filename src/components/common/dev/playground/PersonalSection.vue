<template>
    <BaseSection
        title="Personal Information"
        subtitle="You may not update this information on your own. In case some of your personal information has changed, please contact our support staff."
    >
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">First Name</label>
                    <input v-model="myFirstName" type="text" class="w-full input-text-tmp" />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Last Name</label>
                    <input v-model="myLastName" type="text" class="w-full input-text-tmp" />
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <birth-date-input v-model:birth-date="myBirthDate" />
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

    export default {
        name: "InputSection",
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
