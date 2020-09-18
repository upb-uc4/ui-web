<template>
    <modal-no-teleport ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="text-2xl text-gray-900">Login</p>
        </template>
        <div class="flex flex-col">
            <p>Please enter your authentication credentials.</p>
            <div class="mb-4 mt-4">
                <i class="mt-4 m-3 ml-4 fas fa-envelope absolute text-gray-500"></i>
                <input
                    id="loginModalEmail"
                    v-model="email"
                    class="lg:w-5/6 font-semibold pl-10 form-input input-text"
                    type="text"
                    placeholder="Email"
                    :class="{ error: error }"
                    @change="hideErrors()"
                    @keypress.enter="login"
                />
            </div>

            <div class="mb-2">
                <i class="mt-4 m-3 ml-4 fas fa-lock absolute text-gray-500"></i>
                <input
                    id="loginModalPassword"
                    v-model="password"
                    :type="passwordFieldType"
                    class="lg:w-5/6 font-semibold pl-10 form-input input-text"
                    placeholder="Password"
                    :class="{ error: error }"
                    @change="hideErrors()"
                    @keypress.enter="login"
                />
                <button
                    id="togglePassword"
                    type="button"
                    tabIndex="-1"
                    class="absolute ml-3 mt-1 text-gray-500 text-lg hover:text-gray-600 focus:outline-none"
                    @click="togglePassword"
                >
                    <i :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']" class="absolute mt-3 ml-1 fas mr-1"></i>
                </button>
                <p v-if="error" class="lg:w-3/4 mt-2 error-message">Wrong username or password!</p>
            </div>
        </div>
        <template #footer>
            <button id="loginModalCancel" class="mr-10 btn-tertiary" @click="close(action.CANCEL)">Cancel</button>
            <button id="loginModalConfirm" class="w-24 py-2 px-2 btn btn-blue-primary" @click="login">Login</button>
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
            let error = ref(false);
            let passwordFieldType = ref("password");
            let loginResponseHandler: LoginResponseHandler = new LoginResponseHandler();

            enum action {
                CANCEL,
                LOGIN,
            }

            function isPasswordVisible() {
                return passwordFieldType.value === "text";
            }

            function hideErrors() {
                error.value = false;
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
                    error.value = true;
                }
            }

            function close(action: action) {
                password.value = "";
                error.value = false;
                baseModal.value.close(action);
            }

            return {
                email,
                login,
                baseModal,
                error,
                password,
                show,
                close,
                action,
                isPasswordVisible,
                hideErrors,
                togglePassword,
                passwordFieldType,
            };
        },
    };
</script>
