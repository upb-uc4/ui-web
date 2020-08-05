<template>
    <div class="flex flex-col bg-white rounded-lg shadow">
        <div v-for="(user, index) in shownUsers" :key="user">
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
    import { computed, ref } from "vue";

    export default {
        name: "AccountList",
        components: {
            UserRow,
        },
        props: {
            selectedRole: {
                type: String,
                required: true,
            },
        },
        async setup(props: any) {
            const userManagement: UserManagement = new UserManagement();

            const genericResponseHandler = new GenericResponseHandler();
            const response = await userManagement.getAllUsers();
            const userLists = genericResponseHandler.handleReponse(response);
            let users = Object.values(userLists).flat();
            let shownUsers = computed(() => {
                return props.selectedRole == ("All" as Role) ? users : users.filter((e) => e.role == props.selectedRole);
            });

            return {
                shownUsers,
            };
        },
    };
</script>
