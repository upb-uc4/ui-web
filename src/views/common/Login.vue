<template>
    <div class="flex justify-center">
        <div class="absolute left-0 w-full bg-hero-circuit-board" style="height: calc(100vh - 80px)" />
        <form class="sm:mt-24 mt-8 max-w-lg w-full" @submit.prevent="login">
            <div class="">
                <img class="hidden sm:block mx-auto h-32 w-auto" src="../../assets/logo/logo.svg" alt="uc4_logo" />
                <h2 class="sm:mt-2 text-center text-3xl font-bold text-blue-700 leading-snug">University Credits 4.0</h2>
            </div>
            <div class="sm:mt-10 mt-4 bg-white sm:p-10 py-8 p-4 rounded-lg shadow-lg relative">
                <div v-show="hasError" class="mb-6">
                    <span class="text-red-500 font-medium tracking-wide">{{ errorText }}</span>
                </div>
                <input type="hidden" name="remember" value="true" />
                <div class="rounded-md shadow-sm">
                    <div class="">
                        <label class="block mb-1 text-gray-700 font-medium tracking-wide">Email Address</label>
                        <input
                            id="email"
                            v-model="email"
                            type="text"
                            :class="[hasError ? 'border-red-500' : 'border-gray-300']"
                            class="appearance-none rounded-lg block w-full px-3 py-3 border-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                            placeholder=""
                            @input="resetError"
                        />
                    </div>
                    <div class="mt-6 relative">
                        <label class="block mb-1 text-gray-700 font-medium tracking-wide">Password</label>
                        <i
                            :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                            class="fas absolute z-20 mt-4 mr-4 right-0 text-gray-500 cursor-pointer"
                            @click="togglePassword"
                        />
                        <input
                            id="password"
                            v-model="password"
                            :type="passwordFieldType"
                            :class="[hasError ? 'border-red-500' : 'border-gray-300']"
                            class="appearance-none rounded-lg block w-full px-3 py-3 pr-12 border-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                            placeholder=""
                            @input="resetError"
                        />
                    </div>
                </div>

                <div class="mt-10">
                    <button
                        id="login"
                        :disabled="isInputEmpty"
                        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed"
                        @click="login"
                    >
                        Login
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
    import Router from "@/use/router/";
    import { computed, ref } from "vue";
    import LoginResponseHandler from "@/use/helpers/LoginResponseHandler";
    import AuthenticationManagement from "@/api/AuthenticationManagement";
    export default {
        components: {},
        props: [],
        setup() {
            const email = ref("");
            const password = ref("");
            const passwordFieldType = ref("password");
            const hasError = ref(false);
            const errorText = ref("You have entered an invalid email or password.");

            function togglePassword() {
                passwordFieldType.value = isPasswordVisible() ? "password" : "text";
            }

            function isPasswordVisible() {
                return passwordFieldType.value === "text";
            }

            let isInputEmpty = computed(() => {
                return email.value === "" || password.value === "";
            });

            async function login() {
                const username = email.value;
                const response = await AuthenticationManagement._getRefreshToken({ username: username, password: password.value });
                let loginResponseHandler: LoginResponseHandler = new LoginResponseHandler();
                const loginSuccess = loginResponseHandler.handleResponse(response);

                if (loginSuccess) {
                    Router.push({ name: "welcome" });
                } else {
                    hasError.value = true;
                }
            }

            function resetError() {
                hasError.value = false;
            }

            return {
                email,
                password,
                passwordFieldType,
                hasError,
                errorText,
                togglePassword,
                isPasswordVisible,
                isInputEmpty,
                login,
                resetError,
            };
        },
    };
</script>
