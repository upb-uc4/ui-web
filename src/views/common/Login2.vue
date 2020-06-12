<template>
<div>
    <dev-nav-bar></dev-nav-bar>
    <div class="container max-w-full h-full h-auto flex flex-col lg:flex-row lg:items-center">
        <form v-on:submit.prevent="login" method="POST" action="" class="xl:w-3/4 w-full flex items-center flex-col mx-auto">
            <input type="hidden" name="_token" :value="csrf">
            <h1 class="lg:text-6xl mt-2 text-4xl font-bold mb-4 text-center text-gray-900 mb-10">Login to Your Account</h1>

            <div class="w-full flex">
                <div class="sm:pl-40 md:pl-56 lg:pl-64 xl:pl-56 mx-4 w-full">

                    <div class="mb-6 sm:w-1/4 md:w-3/4 lg:w-4/4">
                        <label class="sr-only-focusable sr-only font-semibold text-gray-900 block mb-2">Email</label>
                        <i class="m-3 fas fa-envelope absolute text-gray-500"></i>
                        <input v-model="email" class="justify-start lg:w-3/4 block appearance-none shadow-md font-semibold bg-gray-200 text-gray-600 placeholder-gray-600 focus:text-gray-600 p-2 pl-10 rounded hover:border-gray-300 focus:outline-none focus:shadow-outline" type="text" placeholder="Email" name="email">
                    </div>

                    <div class="mb-6 sm:w-1/4 md:w-3/4 lg:w-4/4">
                        <label class="sr-only-focusable sr-only font-semibold text-gray-900 block">Password</label>
                        <i class="m-3 fas fa-lock absolute text-gray-500"></i>
                        <div class="flex">
                            <input v-model="password" ref="password" :type="passwordFieldType" v-on:input="hideErrors" name="password" class="lg:w-3/4 shadow-md block appearance-none  font-semibold bg-gray-200 text-gray-600 placeholder-gray-600 focus:text-gray-600 p-2 pl-10 rounded hover:border-gray-300 focus:outline-none focus:shadow-outline" placeholder="Password">
                            <button @click="togglePassword" type=button tabIndex="-1" class="relative ml-3 visible text-gray-500 text-sm hover:text-gray-600 focus:outline-none">
                                <i :class="[isPasswordVisible ? 'fa-eye-slash' : 'fa-eye']" class="fas mr-1"></i>
                            </button>
                        </div>
                    </div>

                    <div class="w-full lg:w-3/4 sm:items-center justify-between">
                        <label class="block text-gray-500 font-semibold">
                            <input class="mr-2 form-checkbox text-blue-500 hover:bg-blue-400 hover:shadow-inner border-gray-500 border-1 focus:border-none" type="checkbox" checked>
                            <span class="text-sm">Remember me</span>
                        </label>
                        <a class="mt-2 no-underline inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-600" href="#">
                            Forgot Password?
                        </a>
                    </div>

                    <div class="mt-10 flex mb-6 sm:w-1/4 md:w-3/4 lg:w-4/4  lg:justify-start text-center">
                        <button type=submit :disabled="isInputEmpty" class="w-3/4 bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none text-white font-semibold py-2 px-4 rounded focus:shadow-outline hover:bg-blue-400 disabled:bg-blue-500">
                            Login
                        </button>
                    </div>

                </div>
            </div>
        </form>
    </div>
</div>
</template>

<script>
    import DevNavBar from "../../components/dev_components/DevNavBar.vue"

    export default {
        props: [
            'route',
            'csrf',
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
            isPasswordVisible: function() {
                return this.passwordFieldType === "text";
            },
            isInputEmpty() {
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

            },
        }
    }
</script>