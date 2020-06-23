<template>

    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="navigateBack()" class="flex items-center mb-4 navigation-link">
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
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Role</label>
                            <div class="flex">
                                <div class="mr-4 mb-3" v-for="role in roles" :key="role">
                                    <label class="flex items-center" >
                                        <input type="radio" class="form-radio focus:shadow-none text-blue-700 hover:bg-blue-400" name="role" :value="role" v-model="account.role">
                                        <span class="ml-2 text-gray-700 text-md font-medium">{{ role }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Username</label>
                            <input type="text" id="userName" name="username"
                                class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                placeholder="Username"
                                v-model="account.username">
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label for="password" class="text-gray-700 text-md font-medium mb-3">
                                Password
                            </label>
                            <input type="text" id="password" name="password"
                                class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                placeholder="Password"
                                v-model="account.password">
                        </div>
                    </div>
                </div>
            </section>


            <section class="border-t-2 py-8 border-gray-400 lg:mt-8 flex justify-end items-center">
                <button type="button" @click="navigateBack" class="w-32 mr-6 btn btn-blue-secondary">
                    Cancel
                </button>
                <button type="submit" class="w-48 btn btn-blue-primary"
                v-bind:disabled="!hasInput">
                    Create Account
                </button>
            </section>
        </form>

    </div>
</template>

<script lang="ts">
import Router from "@/router/";
import {Account} from '@/entities/Account'
import {Role} from '@/entities/Role'
import { store } from '@/store/store';
import Authentication_Management from "@/api/Authentication_Management"
import { ref, computed } from 'vue';

export default {
    name: "AdminCreateAccountForm",
    props: {

    },
    setup() {
        let account = ref(new Account());
        let success:boolean = false;
        let roles = Object.values(Role).filter(e => e!=Role.NONE);


        function isValid() {
             if(account.value.username == "" || account.value.password =="" || account.value.role == Role.NONE) {
                return false;
            }
            return true;
        }

        let hasInput = computed(() => {
            if(account.value.username != "" || account.value.password != "" || account.value.role != Role.NONE) {
                return true;
            }
            return false;
        })

        function navigateBack() {
            Router.go(-1);
        }

        function submit() {
             if(isValid()) {    
                const authentication_management: Authentication_Management = new Authentication_Management();
                authentication_management.createAccount(account.value).then(() =>{
                    //handle errors, ...
                })
            }
            else {
                success = false;
            }
        }

        return {
            account,
            success,
            roles,
            isValid,
            navigateBack,
            hasInput,
            submit
        }
    },

	beforeRouteEnter(_from: any, _to: any, next: any) {
		const myRole = store.state.myRole;
		if (myRole != Role.ADMIN) {
			return next("/redirect");
		}
		return next();
	},
    beforeRouteLeave (to: any, from: any, next: any) {
        //todo use styled modal
        //todo break this into smaller methods
        if (this.success) {
            return next();
        }
        else if (this.hasInput) {
            const answer = window.confirm('Do you really want to leave? You have unsaved changes!')
            if (answer) {
                return next()
            } else {
                return next(false)
            }
        }
        else {
            return next()
        }
    }
};
</script>
