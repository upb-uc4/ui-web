<template>
    <div>
        <dev-nav-bar></dev-nav-bar>
        <div class="md:mt-32 container max-w-full h-full h-auto flex flex-col lg:flex-row lg:items-center">
            <form v-on:submit.prevent="login" method="POST" action="" class="xl:w-3/4 w-full flex items-center flex-col mx-auto">
                <h1 class="lg:text-5xl mt-2 text-4xl font-bold mb-4 text-center text-gray-900 mb-10">Login to Your Account</h1>

                <div class="w-full lg:w-3/5 mx-4 flex-auto items-center justify-center">
                    <div class="mb-6 text-center">
                        <i class="m-3 fas fa-envelope absolute text-gray-500"></i>
                        <input v-model="email" class="inline-block center lg:w-3/4 block appearance-none shadow-md font-semibold bg-gray-200 text-gray-600 placeholder-gray-600 focus:text-gray-600 p-2 pl-10 rounded hover:border-gray-300 focus:outline-none focus:shadow-outline" type="text" placeholder="Email" name="email">
                    </div>

                    <div class="mb-6 text-center ">
                        <i class="m-3 fas fa-lock absolute text-gray-500"></i>
                        <input v-model="password" :type="passwordFieldType" v-on:input="hideErrors()" class="lg:w-3/4 shadow-md inline-block center appearance-none  font-semibold bg-gray-200 text-gray-600 placeholder-gray-600 focus:text-gray-600 p-2 pl-10 rounded hover:border-gray-300 focus:outline-none focus:shadow-outline" placeholder="Password">
                        <button @click="togglePassword" type=button tabIndex="-1" class="display-none absolute inline-block center ml-3 visible text-gray-500 text-sm hover:text-gray-600 focus:outline-none">
                            <i :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']" class="display-none absolute mt-3 ml-1 fas mr-1"></i>
                        </button>
                    </div>

                    <div class="w-full text-center lg:text-left lg:pl-16 lg:ml-3">
                        <label class="block text-gray-500 font-semibold">
                            <input class="mr-2 form-checkbox text-blue-500 hover:bg-blue-600" type="checkbox" checked>
                            <span class="text-sm">Remember me</span>
                        </label>
                        <a class="mt-2 inline-block font-semibold text-sm navigation-link" href="#">
                            Forgot Password?
                        </a>
                    </div>

                    <div class="mt-10 mb-6 justify-center text-center">
                        <button type=submit :disabled="isInputEmpty()" class="w-2/5 sm:w-2/5 md:w-2/5 lg:w-2/4 inline-block center btn btn-blue-primary">
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
    import UserManagement from "@/api/UserManagement"
    import { ref } from 'vue';

    export default {
        props: [
        ],
        components: {
            DevNavBar
        },
        setup() {
            let email = ref("");
            let password = ref("");
            let passwordFieldType =ref("password")
            let error:boolean= false;


            function togglePassword () {  
                passwordFieldType.value = isPasswordVisible() ? "password" : "text"; 
            }
            
            function hideErrors() {
                error = false;
            }

            function isPasswordVisible() {
                return passwordFieldType.value === "text";
            }

            function isInputEmpty() {
                 return email.value === "" || password.value === "";
            }

            function login() {
                const username = email.value;
                const userManagement: UserManagement = new UserManagement();

                userManagement.login({username: username, password: password.value})
                    .then((success : boolean)=> {
                        if (success) {
                            store.state.myId = username;
                            switch(store.state.myRole) {
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
                            //TODO: show auth error
                        }
                    })
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
            }
        },
       
    }
</script>