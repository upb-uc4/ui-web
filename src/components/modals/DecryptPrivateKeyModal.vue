<template>
    <modal ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="text-2xl text-gray-900">Confirmation Needed</p>
        </template>
        <div class="flex flex-col">
            <p>Please enter the password you used to encrypt your private key. This may differ from your regular application password.</p>
            <div class="mt-6 relative">
                <i
                    :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                    class="fas absolute mt-4 mr-4 right-0 text-gray-500 cursor-pointer"
                    @click="togglePassword"
                />
                <input
                    id="enterDecryptionPassword"
                    v-model="password"
                    :type="passwordFieldType"
                    class="w-full form-input input-text"
                    :class="{ error: hasError }"
                    placeholder="Enter Decryption Password"
                    @keypress.enter="checkPassword"
                />
            </div>
            <p v-if="hasError" class="error-message">Wrong Password!</p>
        </div>
        <template #footer>
            <button id="decryptPrivateKeyModalCancel" class="mr-10 btn-tertiary" @click="close(action.CANCEL)">Cancel</button>
            <button id="decryptPrivateKeyModalConfirm" class="w-24 px-2 py-2 btn btn-blue-primary" @click="checkPassword">Confirm</button>
        </template>
    </modal>
</template>

<script lang="ts">
    import Modal from "@/components/modals/Modal.vue";
    import { ref } from "vue";

    export default {
        components: {
            Modal,
        },
        setup() {
            const baseModal = ref();
            let hasError = ref(false);
            let password = ref("");
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
                return await baseModal.value.show();
            }

            async function checkPassword() {
                //TODO implement
            }

            function close(action: action) {
                password.value = "";
                hasError.value = false;
                baseModal.value.close(action);
            }

            return {
                togglePassword,
                isPasswordVisible,
                passwordFieldType,
                hasError,
                checkPassword,
                baseModal,
                password,
                show,
                close,
                action,
            };
        },
    };
</script>
