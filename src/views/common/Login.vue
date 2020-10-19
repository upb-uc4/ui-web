<template>
    <div>
        <div class="container flex flex-col h-auto max-w-full md:mt-32 lg:flex-row lg:items-center">
            <form method="POST" action="" class="flex flex-col items-center w-full mx-auto xl:w-3/4" @submit.prevent="login">
                <img src="../../assets/logo/logo_long_title_right.svg" class="md:w-1/3 w-1/2 mt-3" />
                <h1 class="mt-2 mb-10 text-4xl font-bold text-center text-gray-900 lg:text-5xl">Login to Your Account</h1>

                <div class="items-center justify-center flex-auto w-full mx-4 lg:w-3/5">
                    <div class="mb-6 text-center">
                        <i class="absolute m-3 mt-4 ml-4 text-gray-500 fas fa-envelope"></i>
                        <input
                            id="email"
                            v-model="email"
                            class="pl-10 font-semibold lg:w-3/4 form-input input-text"
                            type="text"
                            placeholder="Email"
                            :class="{ error: error }"
                            @change="hideErrors()"
                        />
                    </div>

                    <div class="mb-6 text-center">
                        <i class="absolute m-3 mt-4 ml-4 text-gray-500 fas fa-lock"></i>
                        <input
                            id="password"
                            v-model="password"
                            :type="passwordFieldType"
                            class="pl-10 font-semibold lg:w-3/4 form-input input-text"
                            placeholder="Password"
                            :class="{ error: error }"
                            @change="hideErrors()"
                        />
                        <button
                            id="togglePassword"
                            type="button"
                            tabIndex="-1"
                            class="absolute mt-1 ml-3 text-lg text-gray-500 hover:text-gray-600 focus:outline-none"
                            @click="togglePassword"
                        >
                            <i :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']" class="absolute mt-3 ml-1 mr-1 fas"></i>
                        </button>
                        <p v-if="error" class="mt-2 lg:w-3/4 lg:ml-3 xl:ml-5 error-message">Wrong username and password combination!</p>
                    </div>

                    <div class="w-full text-center lg:text-left lg:pl-16 lg:ml-3">
                        <label class="block font-semibold text-gray-500">
                            <input id="rememberMe" class="mr-2 text-blue-500 form-checkbox hover:bg-blue-600" type="checkbox" checked />
                            <span class="text-sm">Remember me</span>
                        </label>
                        <a id="forgotPassword" class="inline-block mt-2 text-sm font-semibold navigation-link" href="#">
                            Forgot Password?
                        </a>
                    </div>

                    <div class="justify-center mt-10 mb-6 text-center">
                        <button
                            id="login"
                            type="submit"
                            :disabled="isInputEmpty()"
                            class="inline-block w-2/5 sm:w-2/5 md:w-2/5 lg:w-2/4 center btn btn-blue-primary"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
    import Router from "@/use/router/";
    import { useStore, store } from "@/use/store/store";
    import { Role } from "@/entities/Role";
    import UserManagement from "@/api/UserManagement";
    import { ref, onMounted } from "vue";
    import LoginResponseHandler from "@/use/helpers/LoginResponseHandler";
    import AuthenticationManagement from "@/api/AuthenticationManagement";
    import { useToast } from "vue-toastification";

    export default {
        components: {},
        props: [],
        setup() {
            let email = ref("");
            let password = ref("");
            let passwordFieldType = ref("password");
            let error = ref(false);
            let loginResponseHandler: LoginResponseHandler = new LoginResponseHandler();

            const toast = useToast();
            toast("I'm a toast!");

            function togglePassword() {
                //passwordFieldType.value = isPasswordVisible() ? "password" : "text";
                toast.info("I'm an info toast!");
            }

            function hideErrors() {
                error.value = false;
            }

            function isPasswordVisible() {
                return passwordFieldType.value === "text";
            }

            function isInputEmpty() {
                return email.value === "" || password.value === "";
            }

            async function login() {
                const username = email.value;
                const response = await AuthenticationManagement._getRefreshToken({ username: username, password: password.value });

                const loginSuccess = loginResponseHandler.handleResponse(response);

                if (loginSuccess) {
                    Router.push("/welcome");
                } else {
                    error.value = true;
                }
            }

            return {
                email,
                password,
                passwordFieldType,
                error,
                isPasswordVisible,
                isInputEmpty,
                togglePassword,
                hideErrors,
                login,
                toast,
            };
        },
    };
</script>
