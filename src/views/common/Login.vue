<template>
    <base-view class="flex flex-col justify-center">
        <div class="mt-2">
            <img class="hidden sm:block mx-auto h-16 w-auto" src="@/assets/logo/logo.svg" alt="uc4_logo" />
            <h2 class="mt-6 text-center text-2xl text-gray-700 dark:text-gray-300 tracking-tighter">Log in to University Credits 4.0</h2>
        </div>
        <div v-show="hasError" class="relative mt-4 flex justify-center items-center">
            <span
                class="max-w-sm w-full text-sm tracking-wide py-3.5 px-6 rounded-md align-middle text-gray-800 bg-red-100 border border-red-400"
            >
                {{ errorText }}
                <i class="fa fa-times ml-20 pl-1 cursor-pointer text-red-400" @click="resetError" />
            </span>
        </div>
        <form class="flex justify-center" @submit.prevent="login">
            <div
                class="max-w-sm w-full mt-6 bg-gray-50 dark:bg-night-base border border-gray-200 dark:border-night-base sm:px-6 py-6 p-4 rounded-lg shadow-lg relative"
            >
                <div class="rounded-md shadow-sm">
                    <div class="">
                        <label class="input-label">Username</label>
                        <input
                            id="email"
                            v-model="email"
                            autofocus
                            type="text"
                            :class="[hasError ? 'input-text-error' : 'input-text']"
                            class="w-full bg-white"
                            @input="resetError"
                        />
                    </div>
                    <div class="mt-6 relative">
                        <label class="input-label">Password</label>
                        <i
                            :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                            class="fas absolute z-20 mt-2.5 mr-4 right-0 text-gray-500 cursor-pointer"
                            @click="togglePassword"
                        />
                        <input
                            id="password"
                            v-model="password"
                            :type="passwordFieldType"
                            :class="[hasError ? 'input-text-error' : 'input-text']"
                            class="w-full bg-white"
                            @input="resetError"
                        />
                    </div>
                </div>

                <div class="mt-8">
                    <button id="login" class="w-full btn" :disabled="hasNoInputEntered" @click="login">Login</button>
                </div>
            </div>
        </form>
    </base-view>
</template>

<script lang="ts">
    import Router from "@/use/router/";
    import { computed, ref } from "vue";
    import LoginResponseHandler from "@/use/helpers/LoginResponseHandler";
    import AuthenticationManagement from "@/api/AuthenticationManagement";
    import BaseView from "@/views/common/BaseView.vue";

    export default {
        components: {
            BaseView,
        },
        props: [],
        setup() {
            const email = ref("");
            const password = ref("");
            const passwordFieldType = ref("password");
            const hasError = ref(false);
            const errorText = ref("Incorrect username or password.");
            const hasNoInputEntered = computed(() => email.value === "" || password.value === "");

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
                hasNoInputEntered,
            };
        },
    };
</script>
