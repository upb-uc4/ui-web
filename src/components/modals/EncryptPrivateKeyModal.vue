<template>
    <modal-no-teleport ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="text-2xl text-gray-900">Choose Encryption Password</p>
        </template>
        <div class="flex flex-col">
            <div class="my-2 w-full flex justify-center">
                <div class="fa-stack fa-2x">
                    <i class="fas fa-circle fa-stack-2x text-blue-200" />
                    <i class="fas fa-exclamation fa-stack-1x text-blue-700" />
                </div>
            </div>
            <p>
                Please choose a password to encrypt your private key, so it can be securely stored on our servers. Ensure that you do not lose this password as it <span class="text-blue-800 font-semibold">cannot be restored</span>.
            </p>
            <div class="mt-6 relative">
                <i
                    :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                    class="fas absolute mt-4 mr-4 right-0 text-gray-500 cursor-pointer"
                    @click="togglePassword"
                />
                <input
                    id="enterEncryptionPassword"
                    v-model="password"
                    :type="passwordFieldType"
                    class="w-full form-input input-text"
                    :class="{ error: hasError }"
                    placeholder="Enter Encryption Password"
                    @keypress.enter="checkPassword"
                />
            </div>

            <div class="mt-6 relative">
                <i
                    :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                    class="fas absolute mt-4 mr-4 right-0 text-gray-500 cursor-pointer"
                    @click="togglePassword"
                />
                <input
                    id="confirmEncryptionPassword"
                    v-model="passwordConfirmation"
                    :type="passwordFieldType"
                    class="w-full form-input input-text"
                    :class="{ error: hasError }"
                    placeholder="Confirm Encryption Password"
                    @keypress.enter="checkPassword"
                />
            </div>
            <p v-if="hasError" class="error-message">Please make sure password and confirmation match.</p>
        </div>
        <template #footer>
            <button id="encryptPrivateKeyModalCancel" class="mr-10 btn-tertiary" @click="close(action.CANCEL)">Cancel</button>
            <button id="encryptPrivateKeyModalConfirm" class="w-24 px-2 py-2 btn btn-blue-primary" @click="close(action.CONFIRM)">
                Confirm
            </button>
        </template>
    </modal-no-teleport>
</template>

<script lang="ts">
    import ModalNoTeleport from "@/components/modals/ModalNoTeleport.vue";
    import { ref } from "vue";

    export default {
        components: {
            ModalNoTeleport,
        },
        setup() {
            const baseModal = ref();
            let hasError = ref(false);
            let password = ref("");
            let passwordConfirmation = ref("");
            let passwordFieldType = ref("password");

            enum action {
                CANCEL,
                CONFIRM,
            }

            function togglePassword() {
                passwordFieldType.value = isPasswordVisible() ? "password" : "text";
            }

            function isPasswordVisible() {
                return passwordFieldType.value === "text";
            }

            async function show() {
                await baseModal.value.show();
                let tempPassword = password.value;
                password.value = "";
                passwordConfirmation.value = "";
                return tempPassword;
            }

            async function checkPassword() {
                hasError.value = password.value !== passwordConfirmation.value;
            }

            function close(a: action) {
                checkPassword();
                if (a == action.CANCEL) {
                    baseModal.value.close(a);
                }

                if (a == action.CONFIRM) {
                    if (!hasError.value) {
                        baseModal.value.close(action.CONFIRM);
                    }
                }
            }

            return {
                togglePassword,
                isPasswordVisible,
                passwordFieldType,
                hasError,
                checkPassword,
                baseModal,
                password,
                passwordConfirmation,
                show,
                close,
                action,
            };
        },
    };
</script>
