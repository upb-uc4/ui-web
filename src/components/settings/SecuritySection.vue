<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Security</label>
                </div>
                <label class="block text-gray-600">
                    Make sure to choose a strong password; Longer passwords are generally more secure.
                </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="lg:flex mb-6">
                    <div v-if="!editPassword" class="lg:w-1/2 w-full mb-6 lg:mb-0 flex flex-col lg:mr-16">
                        <div class="flex items-baseline">
                            <label class="text-gray-700 text-md font-medium mb-3">Password</label>
                            <button id="updatePassword" class="ml-3 text-sm btn-blue-tertiary" @click="confirmIdentity">Update</button>
                        </div>
                        <input
                            id="currentPassword"
                            value="PLACEHOLDER"
                            disabled
                            :type="passwordFieldType"
                            class="w-full input-text form-input"
                        />
                    </div>
                    <div v-else class="lg:w-1/2 w-full lg:mb-0 flex flex-col lg:mr-16 lg:pr-8">
                        <div class="flex flex-col mb-6">
                            <label class="text-gray-700 text-md font-medium mb-3">Change your password</label>
                            <div class="relative flex items-center">
                                <input
                                    id="newPassword"
                                    v-model="newPassword"
                                    :type="passwordFieldType"
                                    class="w-full input-text form-input pr-10"
                                    placeholder="New Password"
                                />
                                <button
                                    id="toggleNewPassword"
                                    type="button"
                                    class="absolute right-0 text-gray-500 text-lg hover:text-gray-600 focus:outline-none"
                                    @click="togglePassword"
                                >
                                    <i :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']" class="fas mr-4"></i>
                                </button>
                            </div>
                        </div>

                        <div class="flex flex-col mb-6">
                            <label class="text-gray-700 text-md font-medium mb-3">Confirm your new password</label>
                            <div class="relative flex items-center">
                                <input
                                    id="confirmationPassword"
                                    v-model="confirmationPassword"
                                    :type="passwordFieldType"
                                    class="w-full input-text form-input pr-10"
                                    placeholder="Confirm Password"
                                />
                                <button
                                    id="toggleConfirmationPassword"
                                    type="button"
                                    class="absolute right-0 text-gray-500 text-lg hover:text-gray-600 focus:outline-none"
                                    @click="togglePassword"
                                >
                                    <i :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']" class="fas mr-4"></i>
                                </button>
                            </div>
                        </div>

                        <div class="flex justify-end">
                            <button id="cancelPasswordChange" class="px-2 btn btn-blue-secondary w-24 mr-6 text-sm" @click="cancel">
                                Cancel
                            </button>
                            <button
                                id="changePassword"
                                class="px-2 btn btn-blue-primary text-sm w-48"
                                :disabled="passwordMatch"
                                @click="updatePassword"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <enter-password-modal ref="enterPasswordModal" />
    </section>
</template>

<script lang="ts">
    import { ref, computed } from "vue";
    import { store } from "@/store/store";
    import EnterPasswordModal from "@/components/modals/EnterPasswordModal.vue";
    import UserManagement from "@/api/UserManagement";
    import GenericResponseHandler from "@/use/GenericResponseHandler";
    import AuthenticationManagement from "../../api/AuthenticationManagement";

    export default {
        name: "SecuritySection",
        components: {
            EnterPasswordModal,
        },
        setup() {
            let passwordFieldType = ref("password");
            let editPassword = ref(false);
            let enterPasswordModal = ref();
            let newPassword = ref("");
            let confirmationPassword = ref("");

            let passwordMatch = computed(() => {
                return !(newPassword.value === confirmationPassword.value && newPassword.value != "");
            });

            function togglePassword() {
                passwordFieldType.value = isPasswordVisible() ? "password" : "text";
            }

            function isPasswordVisible() {
                return passwordFieldType.value === "text";
            }

            async function confirmIdentity() {
                let modal = enterPasswordModal.value;
                let action = modal.action;
                modal.show().then((response: typeof action) => {
                    switch (response) {
                        case action.CANCEL: {
                            //do nothing
                            break;
                        }
                        case action.CONFIRM: {
                            passwordFieldType.value = "password";
                            editPassword.value = true;
                            break;
                        }
                    }
                });
            }

            function cancel() {
                passwordFieldType.value = "password";
                newPassword.value = "";
                confirmationPassword.value = "";
                editPassword.value = false;
            }

            async function updatePassword() {
                const genericResponseHandler = new GenericResponseHandler();
                const authenticationManagement: AuthenticationManagement = new AuthenticationManagement();
                const response = await authenticationManagement.changeOwnPassword(newPassword.value);
                const result = genericResponseHandler.handleReponse(response);

                if (result) {
                    //Remove local inputs (if the user wants to change twice in a row)
                    newPassword.value = "";
                    confirmationPassword.value = "";
                    passwordFieldType.value = "password";
                    editPassword.value = false;
                }
            }

            return {
                isPasswordVisible,
                passwordFieldType,
                confirmIdentity,
                updatePassword,
                cancel,
                newPassword,
                confirmationPassword,
                togglePassword,
                passwordMatch,
                editPassword,
                enterPasswordModal,
            };
        },
    };
</script>
