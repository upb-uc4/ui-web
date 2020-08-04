<template>
    <div class="flex flex-col">
        <div class="flex items-baseline w-1/2 mb-3">
            <div v-for="vrole in roles" :key="vrole" class="mb-3">
                <label class="inline-flex">
                    <button 
                        class="px-4 py-2 text-gray-800 bg-gray-400 border-gray-500 shadow-sm outline-none hover:bg-gray-500" 
                        :class="{ 'bg-gray-500 shadow-none' : selectedRole == vrole }" @click="select(vrole)">
                        {{vrole}}
                    </button>
                </label>
            </div>
        </div> 
        <div class="bg-white rounded-lg shadow" v-for="(user, index) in shownUsers" :key="user">
            <user-row :user="user" :is-first-row="index === 0" :is-last-row="index === shownUsers.length - 1" />
        </div>
    </div>
</template>

<script lang="ts">
    import UserManagement from "../api/UserManagement";
    import router from "../router";
    import GenericResponseHandler from "@/use/GenericResponseHandler";
    import UserRow from "@/components/account/UserRow.vue";
    import { Role } from "@/entities/Role"
    import { computed, ref } from 'vue';

    export default {
        name: "AccountList",
        components: {
            UserRow,
        },
        async setup() {
            let roles = Object.values(Role).filter(e => e != Role.NONE);
            roles.push("All" as Role)
            let selectedRole = ref("All" as Role);

            const userManagement: UserManagement = new UserManagement();

            const genericResponseHandler = new GenericResponseHandler();
            const response = await userManagement.getAllUsers();
            const userLists = genericResponseHandler.handleReponse(response);
            let users = Object.values(userLists).flat();
            let shownUsers = computed(() => {
                return selectedRole.value == "All" as Role ? users : users.filter(e => e.role == selectedRole.value)
            })

            function select(role:string) {
                selectedRole.value = role as Role;
            }
            
            return {
                roles, shownUsers,selectedRole,select
            };
        },
    };
</script>
