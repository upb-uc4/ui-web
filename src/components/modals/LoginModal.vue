<template>
    <modal-no-teleport ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="modal-headline">Login</p>
        </template>
        <div class="flex flex-col w-full">
            <div class="modal-description">Please enter your authentication credentials.</div>

            <div class="my-4">
                <label class="input-label">Email Address</label>
                <input
                    id="loginModalEmail"
                    v-model="email"
                    type="text"
                    :class="[hasError ? 'input-text-error' : 'input-text']"
                    class="w-full"
                    @input="resetError"
                    @keypress.enter="login"
                />
            </div>

            <div class="mb-2 relative">
                <label class="input-label">Password</label>
                <i
                    :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                    class="fas absolute z-20 mt-2.5 mr-4 right-0 text-gray-500 cursor-pointer"
                    @click="togglePassword"
                />
                <input
                    id="loginModalPassword"
                    v-model="password"
                    :type="passwordFieldType"
                    :class="[hasError ? 'input-text-error' : 'input-text']"
                    class="w-full"
                    @input="resetError"
                />
                <label v-if="hasError" class="input-label-error">Wrong username or password!</label>
            </div>
        </div>
        <template #footer>
            <button id="loginModalCancel" class="mr-10 btn-tertiary-modal" @click="close(action.CANCEL)">Cancel</button>
            <button id="loginModalConfirm" class="w-24 py-2 px-2 btn" @click="login">Login</button>
        </template>
    </modal-no-teleport>
</template>

<script lang="ts">
    import ModalNoTeleport from "@/components/modals/ModalNoTeleport.vue";
    import UserManagement from "@/api/UserManagement";
    import { ref } from "vue";
    import LoginResponseHandler from "@/use/helpers/LoginResponseHandler";
    import { useStore } from "@/use/store/store";
    import AuthenticationManagement from "@/api/AuthenticationManagement";

    export default {
        components: {
            ModalNoTeleport,
        },
        setup() {
            const baseModal = ref();
            let email = ref("");
            let password = ref("");
            let hasError = ref(false);
            let passwordFieldType = ref("password");
            let loginResponseHandler: LoginResponseHandler = new LoginResponseHandler();

            enum action {
                CANCEL,
                LOGIN,
            }

            function isPasswordVisible() {
                return passwordFieldType.value === "text";
            }

            function resetError() {
                hasError.value = false;
            }

            function togglePassword() {
                passwordFieldType.value = isPasswordVisible() ? "password" : "text";
            }

            async function show() {
                return await baseModal.value.show();
            }

            async function login() {
                const response = await AuthenticationManagement._getRefreshToken({ username: email.value, password: password.value });
                if (loginResponseHandler.handleResponse(response)) {
                    close(action.LOGIN);
                } else {
                    hasError.value = true;
                }
            }

            function close(action: action) {
                password.value = "";
                hasError.value = false;
                baseModal.value.close(action);
            }

            return {
                email,
                login,
                baseModal,
                hasError,
                password,
                show,
                close,
                action,
                isPasswordVisible,
                resetError,
                togglePassword,
                passwordFieldType,
            };
        },
    };
</script>
