<template>
    <div class="bg-white rounded-lg shadow flex flex-col">
        <div v-for="(user, index) in users" :key="user">
            <user-row :user="user" :is-first-row="index === 0" :is-last-row="index === users.length - 1" />
        </div>
    </div>
</template>

<script lang="ts">
    import UserManagement from "../api/UserManagement";
    import router from "../router";
    import GenericResponseHandler from "@/use/GenericResponseHandler";
    import UserRow from "@/components/account/UserRow.vue";

    export default {
        name: "AccountList",
        components: {
            UserRow,
        },
        async setup() {
            const userManagement: UserManagement = new UserManagement();

            const genericResponseHandler = new GenericResponseHandler();
            const response = await userManagement.getAllUsers();
            const userLists = genericResponseHandler.handleReponse(response);
            let users = Object.values(userLists).flat();

            return {
                users,
            };
        },
    };
</script>
