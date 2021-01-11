<template>
    <BaseSection title="Contact" subtitle="How can we reach you?">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Email</label>
                    <input
                        id="email"
                        v-model="myEmail"
                        type="text"
                        class="w-full"
                        :class="errorBag.hasNested('email') ? 'input-text-error' : 'input-text'"
                    />
                    <label v-if="errorBag.hasNested('email')" class="input-label-error">{{ errorBag.getNested("email") }}</label>
                </div>
                <div class="lg:w-1/2 w-full" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Phone</label>
                    <input
                        id="phoneNumber"
                        v-model="myPhoneNumber"
                        type="text"
                        class="w-full"
                        :class="errorBag.hasNested('phoneNumber') ? 'input-text-error' : 'input-text'"
                    />
                    <label v-if="errorBag.hasNested('phoneNumber')" class="input-label-error">{{
                        errorBag.getNested("phoneNumber")
                    }}</label>
                </div>
                <div class="lg:w-1/2 w-full" />
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        name: "ContactSection",
        components: {
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
