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
                            <button class="ml-3 text-sm btn-blue-tertiary" @click="confirmIdentity">Update</button>
                        </div>
                        <input id="password" v-model="password" disabled type="password" class="w-2/3 input-text form-input" />
                    </div>
                    <div v-else class="w-1/2 lg:mb-0 flex flex-col lg:mr-16">
                        <label class="text-gray-700 text-md font-medium mb-3">Change your password</label>
                        <input
                            id="password"
                            v-model="newPassword"
                            type="password"
                            class="w-full input-text form-input mb-2 mr-10"
                            placeholder="New Password"
                        />
                        <input
                            id="password"
                            v-model="confirmationPassword"
                            type="password"
                            class="w-full input-text form-input mb-4"
                            placeholder="Confirm Password"
                        />
                        <div class="w-full justify-end flex flex-row">
                            <button class="px-2 btn btn-blue-secondary text-sm mr-3" @click="cancel">Cancel</button>
                            <button class="px-2 btn btn-blue-primary text-sm" :disabled="passwordMatch" @click="updatePassword">
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

    export default {
        components: {
            EnterPasswordModal,
        },
        setup() {
            let password = ref(store.state.loginData.password);
            let editPassword = ref(false);
            let enterPasswordModal = ref();
            let newPassword = ref("");
            let confirmationPassword = ref("");

            let passwordMatch = computed(() => {
                return !(newPassword.value === confirmationPassword.value && newPassword.value != "");
            });

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
                            editPassword.value = true;
                            break;
                        }
                    }
                });
            }

            function cancel() {
                newPassword.value = "";
                confirmationPassword.value = "";
                editPassword.value = false;
            }

            function updatePassword() {
                //TODO API call for updating password

                //Remove local inputs (if the user wants to change twice in a row)
                password.value = newPassword.value;
                newPassword.value = "";
                confirmationPassword.value = "";
                editPassword.value = false;
            }

            return {
                confirmIdentity,
                updatePassword,
                cancel,
                password,
                newPassword,
                confirmationPassword,
                passwordMatch,
                editPassword,
                enterPasswordModal,
            };
        },
    };
</script>
