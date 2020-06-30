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
                <tr class="bg-gray-100 hover:bg-gray-400 py-2 cursor-pointer" v-for="user in userListByRole" :key="user.username">
                    <td class="px-2 border border-black text-center" @dblclick="editAccount">{{ user.username }}</td>
                    <td class="px-2 border border-black text-center" @dblclick="editAccount">{{ user.role }}</td>
                    <td class="px-2 border border-black text-center" @dblclick="editAccount">{{ user.matriculationId }}</td>
                    <td class="px-2 border border-black text-center" @dblclick="editAccount">{{ user.lastName }}</td>
                    <td class="px-2 border border-black text-center" @dblclick="editAccount">{{ user.firstName }}</td>
                    <td class="px-2 border border-black">
                        <div class="flex">
                            <button @click="editAccount" title="Edit Account" 
                                class="w-full m-1 bg-gray-100 text-gray-700 hover:text-white hover:bg-blue-800 rounded-lg border border-blue-800"> 
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
import UserManagement from '../api/UserManagement';
import User_List from '../api/api_models/user_management/User_List';
import { Role } from '../entities/Role';
import Admin from '../api/api_models/user_management/Admin';
import { ref } from 'vue';
import Lecturer from '../api/api_models/user_management/Lecturer';
import Student from '../api/api_models/user_management/Student';

export default {
  name: "AccountList",
  async setup() {
    const userManagement: UserManagement = new UserManagement();
    const roles = Object.values(Role).filter(e => e!=Role.NONE);

    let usersByRole = ref({} as User_List)

    await userManagement.getAllUsers().then((response : User_List) => {
            usersByRole.value = response
    });
    
    function editAccount() {
        //TODO open edit account page
        console.log("Edit Me!")
    }

    return {
        roles,
        usersByRole,
        editAccount,
    };
  },
};
</script>
