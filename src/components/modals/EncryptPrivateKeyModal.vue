<template>
    <modal-no-teleport ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="modal-headline">Choose Encryption Password</p>
        </template>
        <div>
            <div class="modal-description">
                Please choose a password to encrypt your private key, so it can be securely stored on our servers. Ensure that you do not
                lose this password as it <span class="text-blue-800 font-medium">cannot be restored</span>.
            </div>
            <div class="mt-6 relative">
                <label class="input-label">Encryption Password</label>
                <i
                    :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                    class="fas absolute z-20 mt-2.5 mr-4 right-0 text-gray-500 cursor-pointer"
                    @click="togglePassword"
                />
                <input
                    id="enterEncryptionPassword"
                    v-model="password"
                    :type="passwordFieldType"
                    class="w-full input-text"
                    :class="[hasError ? 'input-text-error' : 'input-text']"
                    @keypress.enter="checkPassword"
                />
            </div>

            <div class="mt-6 relative">
                <label class="input-label">Confirm Encryption Password</label>
                <i
                    :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                    class="fas absolute z-20 mt-2.5 mr-4 right-0 text-gray-500 cursor-pointer"
                    @click="togglePassword"
                />
                <input
                    id="confirmEncryptionPassword"
                    v-model="passwordConfirmation"
                    :type="passwordFieldType"
                    class="w-full input-text"
                    :class="[hasError ? 'input-text-error' : 'input-text']"
                    @keypress.enter="checkPassword"
                />
            </div>
            <p v-if="hasError" class="input-label-error">Please make sure password and confirmation match.</p>
        </div>
        <template #footer>
            <button id="encryptPrivateKeyModalCancel" class="mr-10 btn-tertiary-modal" @click="close(action.CANCEL)">Cancel</button>
            <button id="encryptPrivateKeyModalConfirm" class="w-24 px-2 py-2 btn" @click="close(action.CONFIRM)">Confirm</button>
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
