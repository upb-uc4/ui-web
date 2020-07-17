<template>
    <div>
        <table class="table w-full">
            <thead>
                <tr class="border border-black bg-gray-400">
                    <th>Username</th>
                    <th>Role</th>
                    <th>Matriculation Number</th>
                    <th>Lastname</th>
                    <th>Firstname</th>
                    <th></th>
                </tr>
            </thead>
            <tbody v-for="userListByRole in usersByRole" :key="userListByRole">
                <tr v-for="user in userListByRole" :key="user.username" class="bg-gray-100 hover:bg-gray-400 py-2 cursor-pointer">
                    <td class="px-2 border border-black text-center" @dblclick="editAccount(user.username)">{{ user.username }}</td>
                    <td class="px-2 border border-black text-center" @dblclick="editAccount(user.username)">{{ user.role }}</td>
                    <td class="px-2 border border-black text-center" @dblclick="editAccount(user.username)">{{ user.matriculationId }}</td>
                    <td class="px-2 border border-black text-center" @dblclick="editAccount(user.username)">{{ user.lastName }}</td>
                    <td class="px-2 border border-black text-center" @dblclick="editAccount(user.username)">{{ user.firstName }}</td>
                    <td class="px-2 border border-black">
                        <div class="flex">
                            <button title="Edit Account" class="w-full m-1 btn-icon-blue" @click="editAccount(user.username)">
                                <i class="inline fas fa-pencil-alt text-lg"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    import UserManagement from "../api/UserManagement";
    import User_List from "../api/api_models/user_management/User_List";
    import { Role } from "../entities/Role";
    import Admin from "../api/api_models/user_management/Admin";
    import { ref } from "vue";
    import Lecturer from "../api/api_models/user_management/Lecturer";
    import Student from "../api/api_models/user_management/Student";
    import router from "../router";
    import GenericResponseHandler from "@/use/GenericResponseHandler";

    export default {
        name: "AccountList",
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

            return {
                roles,
                usersByRole,
                editAccount,
            };
        },
    };
</script>
