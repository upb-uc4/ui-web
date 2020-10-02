<template>
    <modal-no-teleport ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
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
            <button id="decryptPrivateKeyModalConfirm" class="w-24 px-2 py-2 btn btn-blue-primary" @click="close(action.CONFIRM)">
                Confirm
            </button>
        </template>
    </modal-no-teleport>
</template>

<script lang="ts">
    import ModalNoTeleport from "@/components/modals/ModalNoTeleport.vue";
    import { ref } from "vue";
    import { base64ToArrayBuffer, deriveKeyFromPassword, unwrapKey } from "@/use/crypto/certificates";
    import EncryptedPrivateKey from "@/api/api_models/certificate_management/EncryptedPrivateKey";

    export default {
        components: {
            ModalNoTeleport,
        },
        setup() {
            const baseModal = ref();
            let hasError = ref(false);
            let password = ref("");
            let passwordFieldType = ref("password");
            let encKey = {} as EncryptedPrivateKey;
            let key = {} as CryptoKey;

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

            async function show(encryptedKey: EncryptedPrivateKey) {
                encKey = encryptedKey;

                await baseModal.value.show();

                encKey = {} as EncryptedPrivateKey;
                const temp = key;
                key = {} as CryptoKey;
                encKey = {} as EncryptedPrivateKey;
                password.value = "";
                hasError.value = false;
                return temp;
            }

            async function checkPassword() {
                const wrappingKey = await deriveKeyFromPassword(password.value, encKey.salt);
                await unwrapKey(base64ToArrayBuffer(encKey.key), wrappingKey.key, base64ToArrayBuffer(encKey.iv))
                    .then((response) => {
                        hasError.value = false;
                        key = response;
                    })
                    .catch((reason) => {
                        hasError.value = true;
                    });
            }

            async function close(a: action) {
                await checkPassword();
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
                show,
                close,
                action,
            };
        },
    };
</script>
