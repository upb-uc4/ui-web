<template>

    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="navigateBack()" class="flex items-center mb-4">
            <i class="fas text-xl fa-chevron-left text-blue-700"></i>
            <span class="text-blue-700 font-bold text-sm ml-1">Course List</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8">Account Creation</h1>

        <form @submit.prevent="submit" method="POST">
            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Basics</label>
                        <label class="block text-gray-600">
                            This is some long detailed description which is part towards a better form.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3"><div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Role</label>
                            <div class="flex">
                                <div class="mr-4 mb-3">
                                    <label class="flex items-center">
                                        <input type="radio" class="form-radio focus:shadow-none text-indigo-600" name="role" value="Administrator"
                                               >
                                        <span class="ml-2 text-gray-700 text-md font-medium">Administrator</span>
                                    </label>
                                </div>
                                <div class="mr-4">
                                    <label class="flex items-center">
                                        <input type="radio" class="form-radio focus:shadow-none text-indigo-600" name="role" value="Lecturer"
                                               >
                                        <span class="ml-2 text-gray-700 text-md font-medium">Lecturer</span>
                                    </label>
                                </div>
                                <div>
                                    <label class="flex items-center">
                                        <input type="radio" class="form-radio focus:shadow-none text-indigo-600" name="role" value="Student"
                                               >
                                        <span class="ml-2 text-gray-700 text-md font-medium">Student</span>
                                    </label>
                                </div>
                            </div>
                        <div class="mb-4 flex flex-col">
                            <label for="name" class="text-gray-700 text-md font-medium mb-3">Name</label>
                            <div class="flex">
                            <input type="text" id="firstname" name="firstname"
                                   class="w-1/2 border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input mr-2"
                                   placeholder="First Name">
                            <input type="text" id="lastName" name="lastname"
                                   class="w-1/2 border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                   placeholder="Last Name">
                            </div>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Username</label>
                            <input type="text" id="userName" name="username" 
                                   class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                   placeholder="Username">
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label for="description" class="text-gray-700 text-md font-medium mb-3">
                                Password
                            </label>
                             <input type="text" id="password" name="password"
                                   class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                   placeholder="Password">
                        </div>
                        </div>
                    </div>
                </div>
            </section>


            <section class="border-t-2 py-8 border-gray-400 lg:mt-8 flex justify-end items-center">
                <button type="button" @click="navigateBack" class="w-32 text-blue-700 border-2 border-blue-700 text-center py-3 rounded-lg font-semibold tracking-wider focus:outline-none mr-6">
                    Cancel
                </button>
                <button type="submit" class="w-48 bg-blue-700 border-2 border-blue-700 text-white text-center py-3 rounded-lg font-semibold tracking-wide focus:outline-none">
                    Create Account
                </button>
            </section>
        </form>

    </div>
</template>

<script lang="ts">
import Router from "@/router/";
//import { store } from '@/store/store';

//TODO: Add vmodels to the form
//const axios = require("axios");

export default {
    name: "AdmingCreateAccountForm",
    props: {

    },
    data() {
        return {
            //TODO Add User Object
            success: false,
        };
    },
    created() {
    },
    computed: {
        hasInput: function (): boolean {
            //TODO Check Input
            return false;
        }
    },
    methods: {
        navigateBack() {
            Router.go(-1);
        },
        submit() {
            if(this.hasInput) { 
                //TODO Axios Call
            }
            else {
                this.success = false;
                console.log("Error: Input Validation Failed!")
            }

        }
    },
    beforeRouteLeave (to, from, next) {
        //todo use styled modal
        //todo break this into smaller methods
        if (this.success) {
            next();
        }
        else if (this.hasInput) {
            const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
            if (answer) {
                next()
            } else {
                next(false)
            }
        }
        else {
            next()
        }
    }
};
</script>
