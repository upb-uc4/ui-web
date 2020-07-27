<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Settings</label>
                </div>
                <label class="block text-gray-600">
                    This section will be moved to an own view as soon as we can navigate properly with the mega menu on profile hover.
                </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="lg:flex mb-6">
                    <div v-if="!editPassword" class="w-1/2 mb-6 lg:mb-0 flex flex-col lg:mr-16">
                        <div class="flex items-baseline">
                            <label class="text-gray-700 text-md font-medium mb-3">Password</label>
                            <button id="updatePassword" class="ml-3 text-sm btn-blue-tertiary" @click="confirmIdentity">Update</button>
                        </div>
                        <input
                            id="currentPassword"
                            value="PLACEHOLDER"
                            disabled
                            :type="passwordFieldType"
                            class="w-10/12 input-text form-input"
                        />
                    </div>
                    <div v-else class="w-1/2 lg:mb-0 flex flex-col lg:mr-16">
                        <label class="text-gray-700 text-md font-medium mb-3">Change your password</label>
                        <div class="flex items-center">
                            <input
                                id="newPassword"
                                v-model="newPassword"
                                :type="passwordFieldType"
                                class="w-10/12 input-text form-input mb-2"
                                placeholder="New Password"
                            />
                            <button
                                id="toggleNewPassword"
                                type="button"
                                class="display-none mb-2 inline-block ml-3 visible text-gray-500 text-lg hover:text-gray-600 focus:outline-none"
                                @click="togglePassword"
                            >
                                <i :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']" class="display-none mt-3 ml-1 fas mr-1"></i>
                            </button>
                        </div>
                        <div class="flex items-center">
                            <input
                                id="confirmationPassword"
                                v-model="confirmationPassword"
                                :type="passwordFieldType"
                                class="w-10/12 input-text form-input mb-2"
                                placeholder="Confirm Password"
                            />
                            <button
                                id="toggleConfirmationPassword"
                                type="button"
                                class="display-none mb-2 inline-block ml-3 visible text-gray-500 text-lg hover:text-gray-600 focus:outline-none"
                                @click="togglePassword"
                            >
                                <i :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']" class="display-none mt-3 ml-1 fas mr-1"></i>
                            </button>
                        </div>
                        <div class="w-10/12 justify-end flex flex-row">
                            <button id="cancelPasswordChange" class="px-2 btn btn-blue-secondary text-sm mr-3" @click="cancel">
                                Cancel
                            </button>
                            <button
                                id="changePassword"
                                class="px-2 btn btn-blue-primary text-sm"
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
    import { Country } from "@/entities/Country";
    import { store } from "@/store/store";
    import EnterPasswordModal from "@/components/modals/EnterPasswordModal.vue";
    import UserManagement from "@/api/UserManagement";
    import GenericResponseHandler from "@/use/GenericResponseHandler";

    export default {
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
                const userManagement: UserManagement = new UserManagement();
                const response = await userManagement.changeOwnPassword(newPassword.value);
                const result = genericResponseHandler.handleReponse(response);

                if (result) {
                    //Remove local inputs (if the user wants to change twice in a row)
                    store.state.loginData.password = newPassword.value;
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
