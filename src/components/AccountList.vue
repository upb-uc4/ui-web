<template>
    <div class="bg-white rounded-lg shadow flex flex-col">
        <div v-for="(user, index) in users" :key="user">
            <user-row :user="user" :is-first-row="index === 0" :is-last-row="index === users.length - 1" />
        </div>
    </div>
</template>

<script lang="ts">
    import UserManagement from "../api/UserManagement";
    import User_List from "../api/api_models/user_management/User_List";
    import { Role } from "@/entities/Role";
    import { ref } from "vue";
    import router from "../router";
    import GenericResponseHandler from "@/use/GenericResponseHandler";
    import UserRow from "@/components/account/UserRow.vue";
    import User from "@/api/api_models/user_management/User";

    export default {
        name: "AccountList",
        components: {
            UserRow,
        },
        async setup() {
            const userManagement: UserManagement = new UserManagement();
            const roles = Object.values(Role).filter((e) => e != Role.NONE);

            let usersByRole = ref({} as User_List);

            const genericResponseHandler = new GenericResponseHandler();
            const response = await userManagement.getAllUsers();
            const result = genericResponseHandler.handleReponse(response);

            usersByRole.value = result;

            function editAccount(username: string) {
                router.push({ path: "/editAccount/" + username });
            }

            //todo move into UserList?
            let users: User[] = [];
            result.students.forEach((student) => users.push(student));
            result.lecturer.forEach((lecturer) => users.push(lecturer));
            result.admins.forEach((admin) => users.push(admin));

            return {
                roles,
                usersByRole,
                editAccount,
                users,
            };
        },
    };
</script>
