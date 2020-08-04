<template>
    <div class="flex flex-col">
        <role-filter v-model:selected-role="selectedRole"/>
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
    import { Role } from "@/entities/Role";
    import { computed, ref } from 'vue';
    import RoleFilter from "./RoleFilter.vue";

    export default {
        name: "AccountList",
        components: {
            RoleFilter,
            UserRow,
        },
        async setup() {
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
                shownUsers,selectedRole
            };
        },
    };
</script>
