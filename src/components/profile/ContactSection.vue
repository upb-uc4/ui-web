<template>
    <BaseSection title="Contact" subtitle="How can we reach you?">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Email</label>
                    <base-input
                        v-model:value="myEmail"
                        :error-message="errorBag.getNested('email')"
                        identifier="email"
                        type="text"
                        class="w-full"
                        placeholder="example@mail.com"
                        validation-query="user.email"
                    />
                </div>
                <div class="lg:w-1/2 w-full" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Phone Number</label>
                    <base-input
                        v-model:value="myPhoneNumber"
                        :error-message="errorBag.getNested('phoneNumber')"
                        identifier="phoneNumber"
                        type="text"
                        class="w-full"
                        placeholder="+49123456789"
                        validation-query="user.phoneNumber"
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
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        name: "ContactSection",
        components: {
            BaseInput,
            BaseSection,
        },
        props: {
            phoneNumber: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            errorBag: {
                type: Object as () => ErrorBag,
                required: true,
            },
        },
        emits: ["update:email", "update:phoneNumber"],
        setup(props: any, { emit }: any) {
            return {
                myPhoneNumber: useModelWrapper(props, emit, "phoneNumber"),
                myEmail: useModelWrapper(props, emit, "email"),
            };
        },
    };
</script>
