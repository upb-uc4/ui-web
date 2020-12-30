<template>
    <BaseSection title="Contact" subtitle="How can we reach you?">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Email</label>
                    <input
                        v-model="myEmail"
                        type="text"
                        class="w-full"
                        :class="errorBag.has('email') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.has('email')" class="input-label-error-tmp">{{ errorBag.get("email") }}</label>
                </div>
                <div class="lg:w-1/2 w-full" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Phone</label>
                    <input
                        v-model="myPhoneNumber"
                        type="text"
                        class="w-full"
                        :class="errorBag.has('phoneNumber') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.has('phoneNumber')" class="input-label-error-tmp">{{ errorBag.get("phoneNumber") }}</label>
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
