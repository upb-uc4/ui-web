<template>
    <BaseSection title="Security" subtitle="Manage the authentication credentials and security related options.">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Username</label>
                    <input
                        id="userName"
                        v-model="accountUsername"
                        type="text"
                        class="w-full input-text-tmp"
                        :class="errorBag.hasNested('username') ? 'input-text-error-tmp' : 'input-text-tmp'"
                        :readonly="editMode"
                    />
                    <label v-if="errorBag.hasNested('username')" class="input-label-error-tmp">
                        {{ errorBag.getNested("username") }}
                    </label>
                </div>
                <div class="invisible lg:w-1/2 w-full" />
            </div>
            <div v-if="!editMode" class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full relative">
                    <label for="password" class="input-label-tmp">Password</label>
                    <i
                        :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                        class="fas absolute z-20 mt-2.5 mr-4 right-0 text-gray-500 cursor-pointer"
                        @click="togglePassword"
                    />
                    <input
                        id="password"
                        v-model="accountPassword"
                        :type="passwordFieldType"
                        class="w-full"
                        :class="errorBag.hasNested('password') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.hasNested('password')" class="input-label-error-tmp">{{ errorBag.getNested("password") }}</label>
                </div>
                <div class="invisible lg:w-1/2 w-full" />
            </div>
            <div v-if="!editMode" class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Government issued ID</label>
                    <input
                        id="governmentId"
                        v-model="accountGovernmentId"
                        type="text"
                        class="w-full"
                        :class="errorBag.hasNested('governmentId') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.hasNested('governmentId')" class="input-label-error-tmp">
                        {{ errorBag.getNested("governmentId") }}
                    </label>
                </div>
                <div class="invisible lg:w-1/2 w-full" />
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { ref } from "vue";

    export default {
        name: "SecuritySection",
        components: {
            BaseSection,
        },
        props: {
            errorBag: {
                type: ErrorBag,
                required: true,
            },
            editMode: {
                type: Boolean,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
            governmentId: {
                type: String,
                required: true,
            },
        },
        emits: ["update:username", "update:password", "update:governmentId"],
        setup(props: any, { emit }: any) {
            const passwordFieldType = ref("password");

            function togglePassword() {
                passwordFieldType.value = isPasswordVisible() ? "password" : "text";
            }

            function isPasswordVisible() {
                return passwordFieldType.value === "text";
            }
            return {
                passwordFieldType,
                togglePassword,
                isPasswordVisible,
                accountUsername: useModelWrapper(props, emit, "username"),
                accountPassword: useModelWrapper(props, emit, "password"),
                accountGovernmentId: useModelWrapper(props, emit, "governmentId"),
            };
        },
    };
</script>
