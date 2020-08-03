<template>
    <div class="flex flex-col">
        <div class="flex justify-between w-1/2 mb-3">
            <label >Show:</label>
            <div v-for="vrole in roles" :key="vrole" class="mb-3 mr-4">
                <label class="flex items-center">
                    <input
                        :id="'role-' + vrole"
                        type="radio"
                        class="form-radio radio"
                        v-model="selectedRole"
                        :value="vrole"
                    />
                    <span class="ml-2 font-medium text-gray-700 text-md">{{ vrole }}</span>
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
            
            return {
                roles, shownUsers,selectedRole
            };
        },
    };
</script>
