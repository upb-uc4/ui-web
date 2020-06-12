<template>

    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="navigateBack()" class="flex items-center mb-4 text-blue-700 hover:text-blue-500">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8">Account Creation</h1>

        <form @submit.prevent="submit" method="POST">
            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Basics</label>
                        <label class="block text-gray-600">
                            Create a new user account. 
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3"><div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Role</label>
                            <div class="flex">
                                <div class="mr-4 mb-3" v-for="role in roles" :key="role">
                                    <label class="flex items-center" >
                                        <input type="radio" class="form-radio focus:shadow-none text-indigo-600 hover:bg-indigo-300 focus:bg-indigo-600 active:bg-indigo-600" name="role" :value="role" v-model="account.role"
                                        >
                                        <span class="ml-2 text-gray-700 text-md font-medium">{{ role }}</span>
                                    </label>
                                </div>
                            </div>
                        <!-- Comment in name fields for the user account, when needed 
                        <div class="mb-4 flex flex-col hidden">
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
                        -->
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Username</label>
                            <input type="text" id="userName" name="username" 
                                   class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                   placeholder="Username"
                                   v-model="account.username">
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label for="description" class="text-gray-700 text-md font-medium mb-3">
                                Password
                            </label>
                             <input type="text" id="password" name="password"
                                   class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                   placeholder="Password"
                                   v-model="account.password">
                        </div>
                        </div>
                    </div>
                </div>
            </section>


            <section class="border-t-2 py-8 border-gray-400 lg:mt-8 flex justify-end items-center">
                <button type="button" @click="navigateBack" class="w-32 text-blue-700 border-2 border-blue-700 text-center py-3 rounded-lg font-semibold tracking-wider focus:outline-none mr-6 hover:bg-gray-400">
                    Cancel
                </button>
                <button type="submit" class="w-48 bg-blue-700 border-2 border-blue-700 text-white text-center py-3 rounded-lg font-semibold tracking-wide focus:outline-none hover:bg-blue-600 disabled:opacity-50 disabled:bg-blue-700 disabled:cursor-not-allowed"
                v-bind:disabled="!hasInput">
                    Create Account
                </button>
            </section>
        </form>

    </div>
</template>

<script lang="ts">
import Router from "@/router/";
import {Account} from '../../entities/Account'
import {Roles} from '../../entities/Role'
import { store } from '@/store/store';
const axios = require("axios");

export default {
    name: "AdmingCreateAccountForm",
    props: {

    },
    data() {
        return {
            account: new Account(),
            success: false,
            roles: Object.values(Roles).filter(e => e!=Roles.NONE)
        };
    },
    created() {
    },
    computed: {
        isValid: function (): boolean {
            if(this.account.username == "" || this.account.password =="" || this.account.role == Roles.NONE) {
                return false;
            }
            return true
        },

        hasInput: function():boolean {
            if(this.account.username != "" || this.account.password != "" || this.account.role != Roles.NONE) {
                return true
            }
            return false;
        }
    },
    methods: {
        navigateBack() {
            Router.go(-1);
        },
        submit() {
            if(this.isValid) {                 
                axios.post("http://localhost:9000/authentication", this.account, {
                    auth: {
                            username: store.state.loginData.username,
                            password: store.state.loginData.password
                    }
                })
                .then((response: any) => {
                    console.log(response); //todo configure esl lint that it does not throw an error on unsed response param.
                    this.success = true;
                    //todo show success toast
                    this.navigateBack();
                })
                .catch((error: any) => {
                    if (error.response.status == "401") {
                        //todo don't loose the account object 
                        Router.push("/login");
                    } else if (error.response.status == "403") {
                        //todo show dialog that they do not have access here
                    }
                })
            }
            else {
                this.success = false;
                console.log(this.account)
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
            const answer = window.confirm('Do you really want to leave? You have unsaved changes!')
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
