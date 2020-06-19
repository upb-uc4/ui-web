<template>
<div>
    <dev-nav-bar></dev-nav-bar>
    <div class="container max-w-full h-full h-auto flex flex-col lg:flex-row lg:items-center">
        <form v-on:submit.prevent="login" method="POST" action="" class="xl:w-3/4 w-full flex items-center flex-col mx-auto">
            <h1 class="lg:text-5xl mt-2 text-4xl font-bold mb-4 text-center text-gray-900 mb-10">Login to Your Account</h1>

            <div class="w-full lg:w-3/5 mx-4 flex-auto items-center justify-center">
                    <div class="mb-6 text-center">
                        <i class="m-3 fas fa-envelope absolute text-gray-500"></i>
                        <input v-model="email" class="inline-block center lg:w-3/4 block appearance-none shadow-md font-semibold bg-gray-200 text-gray-600 placeholder-gray-600 focus:text-gray-600 p-2 pl-10 rounded hover:border-gray-300 focus:outline-none focus:shadow-outline" type="text" placeholder="Email" name="email">
                    </div>

                    <div class="mb-6 text-center ">
                        <i class="m-3 fas fa-lock absolute text-gray-500"></i>
                        <input v-model="password" ref="password" :type="passwordFieldType" v-on:input="hideErrors" name="password" class="lg:w-3/4 shadow-md inline-block center appearance-none  font-semibold bg-gray-200 text-gray-600 placeholder-gray-600 focus:text-gray-600 p-2 pl-10 rounded hover:border-gray-300 focus:outline-none focus:shadow-outline" placeholder="Password">
                        <button @click="togglePassword" type=button tabIndex="-1" class="display-none absolute inline-block center ml-3 visible text-gray-500 text-sm hover:text-gray-600 focus:outline-none">
                            <i :class="[isPasswordVisible ? 'fa-eye-slash' : 'fa-eye']" class="display-none absolute mt-3 ml-1 fas mr-1"></i>
                        </button>
                    </div>

                    <div class="w-full text-center lg:text-left lg:pl-16 lg:ml-3">
                        <label class="block text-gray-500 font-semibold">
                            <input class="mr-2 form-checkbox text-blue-500 hover:bg-blue-400 hover:shadow-inner border-gray-500 border-1 focus:border-none" type="checkbox" checked>
                            <span class="text-sm">Remember me</span>
                        </label>
                        <a class="mt-2 no-underline inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-600" href="#">
                            Forgot Password?
                        </a>
                    </div>

                    <div class="mt-10 mb-6 justify-center text-center">
                        <button type=submit :disabled="isInputEmpty" class="w-2/5 sm:w-2/5 md:w-2/5 lg:w-2/4 inline-block center bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none text-white font-semibold py-2 px-4 rounded focus:shadow-outline hover:bg-blue-400 disabled:bg-blue-500">
                            Login
                        </button>
                    </div>
            </div>
        </form>
    </div>
</div>
</template>
<script lang="ts">
    import DevNavBar from "../../components/dev_components/DevNavBar.vue";
    import Router from "@/router/";
    import { store } from "../../store/store";
    import { Role } from "../../entities/Role";
    import Authentication_Management from "@/api/Authentication_Management"

    // const axios = require("axios");

    export default {
        props: [
        ],
        components: {
            DevNavBar
        },
        data () {
            return {
                email: "",
                password: "",
                passwordFieldType: "password",
                error: false,
            };
        },
        computed: {
            isPasswordVisible: function(): boolean {
                return this.passwordFieldType === "text";
            },
            isInputEmpty(): boolean {
                return this.email === "" || this.password === "";
            }
        },
        methods: {
            togglePassword() {
                this.passwordFieldType = this.isPasswordVisible ? "password" : "text";
            },
            hideErrors() {
                this.error = false;
            },
            login() {
                const username = this.email;
                const password = this.password;

                const authentication_management: Authentication_Management = new Authentication_Management();

                authentication_management.login({username: username, password: password})
                    .then((success : boolean)=> {
                        if (success) {
                            switch(store.state.myRole) {
                                case Role.ADMIN: {
                                    Router.push("/createAccount");
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
                            //TODO: show auth error
                        }
                    })
            },
        }
    }
</script>