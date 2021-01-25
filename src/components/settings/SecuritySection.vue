<template>
    <BaseSection title="Security" subtitle="You may change your password here. Make sure to use a strong password when possible.">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full relative">
                    <label class="input-label">Current Password</label>
                    <i
                        id="toggleOldPassword"
                        :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                        class="fas absolute mt-2.5 mr-4 right-0 text-gray-500 cursor-pointer"
                        @click="togglePassword"
                    />
                    <input
                        id="oldPassword"
                        v-model="oldPassword"
                        :type="passwordFieldType"
                        class="w-full"
                        :class="[hasErrorOldPassword ? 'input-text-error' : 'input-text']"
                        @input="resetOldPasswordError()"
                    />
                    <label class="input-label-error" :class="{ hidden: !hasErrorOldPassword }"> Current password is not valid. </label>
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full relative">
                    <label class="input-label">New Password</label>
                    <i
                        id="toggleNewPassword"
                        :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                        class="fas absolute mt-2.5 mr-4 right-0 text-gray-500 cursor-pointer"
                        @click="togglePassword"
                    />
                    <input
                        id="newPassword"
                        v-model="newPassword"
                        :type="passwordFieldType"
                        class="w-full"
                        :class="[hasErrorNewPassword ? 'input-text-error' : 'input-text']"
                        @input="resetNewPasswordErrors()"
                    />
                    <label class="input-label-error" :class="{ hidden: !hasErrorNewPassword }">
                        {{ errorTextNewPassword }}
                    </label>
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full relative">
                    <label class="input-label">Confirm New Password</label>
                    <i
                        id="toggleConfirmationPassword"
                        :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                        class="fas absolute mt-2.5 mr-4 right-0 text-gray-500 cursor-pointer"
                        @click="togglePassword"
                    />
                    <input
                        id="confirmationPassword"
                        v-model="newPasswordConfirmation"
                        :type="passwordFieldType"
                        class="w-full"
                        :class="[hasErrorNewPassword ? 'input-text-error' : 'input-text']"
                        @input="resetNewPasswordErrors()"
                    />
                    <label class="input-label-error" :class="{ hidden: !hasErrorNewPassword }">
                        {{ errorTextNewPassword }}
                    </label>
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 w-full">
                <div class="lg:w-1/2 w-full flex items-center">
                    <button id="updatePassword" class="w-48 btn" :disabled="isHandlingRequest" @click="tryUpdatePassword()">
                        Update Password
                    </button>
                    <img v-show="isHandlingRequest" src="@/assets/loading-spinner-alt.svg" alt="loading-spinner" class="ml-2 w-6 h-6" />
                </div>
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import { computed, ref } from "vue";
    import { useStore } from "@/use/store/store";
    import AuthenticationManagement from "@/api/AuthenticationManagement";
    import LoginResponseHandler from "@/use/helpers/LoginResponseHandler";
    import { useToast } from "@/toast";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";

    export default {
        name: "SecuritySection",
        components: {
            BaseSection,
        },
        setup() {
            const oldPassword = ref("");
            const newPassword = ref("");
            const newPasswordConfirmation = ref("");
            const matchingPassword = computed(() => newPassword.value === newPasswordConfirmation.value);
            const newPasswordMeetsRequirements = computed(() => newPassword.value !== "");
            const newPasswordIsDifferentThanOldPassword = computed(() => newPassword.value !== oldPassword.value);
            const passwordFieldType = ref("password");
            const isHandlingRequest = ref(false);

            const hasErrorOldPassword = ref(false);
            const hasErrorNewPassword = ref(false);
            const errorTextRequirements = "The new password cannot be empty.";
            const errorTextMatching = "The new passwords have to match.";
            const errorTextOldNewDifferent = "The new password cannot be the same as the old one.";
            const errorTextNewPassword = ref(errorTextRequirements);
            const toast = useToast();

            function togglePassword() {
                passwordFieldType.value = isPasswordVisible() ? "password" : "text";
            }

            function reset() {
                passwordFieldType.value = "password";
                oldPassword.value = "";
                newPassword.value = "";
                newPasswordConfirmation.value = "";
                resetOldPasswordError();
                resetNewPasswordErrors();
            }

            function isPasswordVisible() {
                return passwordFieldType.value === "text";
            }

            function resetOldPasswordError() {
                hasErrorOldPassword.value = false;
            }

            function resetNewPasswordErrors() {
                hasErrorNewPassword.value = false;
            }

            async function tryUpdatePassword() {
                if (!newPasswordMeetsRequirements.value) {
                    errorTextNewPassword.value = errorTextRequirements;
                    hasErrorNewPassword.value = true;
                    return;
                }

                if (!matchingPassword.value) {
                    errorTextNewPassword.value = errorTextMatching;
                    hasErrorNewPassword.value = true;
                    return;
                }

                if (!newPasswordIsDifferentThanOldPassword.value) {
                    errorTextNewPassword.value = errorTextOldNewDifferent;
                    hasErrorNewPassword.value = true;
                    return;
                }

                isHandlingRequest.value = true;
                const isOldPasswordCorrect = await checkOldPasswordCorrectness();

                if (isOldPasswordCorrect) {
                    await sendChangePasswordRequest();
                } else {
                    hasErrorOldPassword.value = true;
                }
                isHandlingRequest.value = false;
            }

            function checkOldPasswordCorrectness() {
                return useStore()
                    .getters.user.then((user) => user.username)
                    .then((username) => AuthenticationManagement._getRefreshToken({ username: username, password: oldPassword.value }))
                    .then((response) => new LoginResponseHandler().handleResponse(response));
            }

            async function sendChangePasswordRequest() {
                const response = await new AuthenticationManagement().changeOwnPassword(newPassword.value);
                if (new GenericResponseHandler("password").handleResponse(response)) {
                    reset();
                    toast.success("Password updated.");
                }
            }

            return {
                oldPassword,
                newPassword,
                newPasswordConfirmation,
                passwordFieldType,
                togglePassword,
                isPasswordVisible,
                tryUpdatePassword,
                isHandlingRequest,
                hasErrorOldPassword,
                hasErrorNewPassword,
                errorTextNewPassword,
                resetNewPasswordErrors,
                resetOldPasswordError,
            };
        },
    };
</script>
