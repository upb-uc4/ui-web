<template>
    <div>
        <div class="md:mt-32 container max-w-full h-auto flex flex-col lg:flex-row lg:items-center">
            <form method="POST" action="" class="xl:w-3/4 w-full flex items-center flex-col mx-auto" @submit.prevent="login">
                <h1 class="lg:text-5xl mt-2 text-4xl font-bold text-center text-gray-900 mb-10">Login to Your Account</h1>

                <div class="w-full lg:w-3/5 mx-4 flex-auto items-center justify-center">
                    <div class="mb-6 text-center">
                        <i class="mt-4 m-3 ml-4 fas fa-envelope absolute text-gray-500"></i>
                        <input
                            id="email"
                            v-model="email"
                            class="lg:w-3/4 font-semibold pl-10 form-input input-text"
                            type="text"
                            placeholder="Email"
                            :class="{ error: error }"
                            @change="hideErrors()"
                        />
                    </div>

                    <div class="mb-6 text-center">
                        <i class="mt-4 m-3 ml-4 fas fa-lock absolute text-gray-500"></i>
                        <input
                            id="password"
                            v-model="password"
                            :type="passwordFieldType"
                            class="lg:w-3/4 font-semibold pl-10 form-input input-text"
                            placeholder="Password"
                            :class="{ error: error }"
                            @change="hideErrors()"
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
                        <p v-if="error" class="lg:w-3/4 lg:ml-3 xl:ml-5 mt-2 error-message">Wrong username and password combination!</p>
                    </div>

                    <div class="w-full text-center lg:text-left lg:pl-16 lg:ml-3">
                        <label class="block text-gray-500 font-semibold">
                            <input id="rememberMe" class="mr-2 form-checkbox text-blue-500 hover:bg-blue-600" type="checkbox" checked />
                            <span class="text-sm">Remember me</span>
                        </label>
                        <a id="forgotPassword" class="mt-2 inline-block font-semibold text-sm navigation-link" href="#">
                            Forgot Password?
                        </a>
                    </div>

                    <div class="mt-10 mb-6 justify-center text-center">
                        <button
                            id="login"
                            type="submit"
                            :disabled="isInputEmpty()"
                            class="w-2/5 sm:w-2/5 md:w-2/5 lg:w-2/4 inline-block center btn btn-blue-primary"
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
    import Router from "@/router/";
    import { useStore, store } from "../../store/store";
    import { Role } from "../../entities/Role";
    import UserManagement from "@/api/UserManagement";
    import { ref, onMounted } from "vue";
    import LoginResponseHandler from "@/use/LoginResponseHandler";

    export default {
        components: {},
        props: [],
        setup() {
            let email = ref("");
            let password = ref("");
            let passwordFieldType = ref("password");
            let error = ref(false);
            let loginResponseHandler: LoginResponseHandler = new LoginResponseHandler();

            function togglePassword() {
                passwordFieldType.value = isPasswordVisible() ? "password" : "text";
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
                const response = await UserManagement.login({ username: username, password: password.value });

                const loginSuccess = loginResponseHandler.handleReponse(response);

                if (loginSuccess) {
                    const store = useStore();
                    switch (await store.getters.role) {
                        case Role.ADMIN: {
                            Router.push("/admin");
                            break;
                        }
                        case Role.LECTURER: {
                            Router.push("/lecturer");
                            break;
                        }
                        case Role.STUDENT: {
                            Router.push("/student");
                            break;
                        }
                    }
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
            };
        },
    };
</script>
