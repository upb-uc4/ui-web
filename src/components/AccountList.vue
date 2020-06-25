<template>
    <div>
        <table class="table-auto w-full">
            <thead>
                <tr class="border border-black bg-gray-400">
                    <th>Username</th>
                    <th>Role</th>
                    <th>Matriculation Number</th>
                    <th>Lastname</th>
                    <th>Firstname</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                 <tr class="bg-gray-100 hover:bg-gray-300 cursor-pointer" v-for="account in accounts" :key="account.username">
                    <td class="px-4 py-2 border border-black text-center" @dblclick="showAccount">{{account.username}}</td>
                    <td class="px-4 py-2 border border-black text-center" @dblclick="showAccount">{{account.role}}</td>
                    <td class="px-4 py-2 border border-black text-center" @dblclick="showAccount">{{account.matNr}}</td>
                    <td class="px-4 py-2 border border-black text-center" @dblclick="showAccount">{{account.lastname}}</td>
                    <td class="px-4 py-2 border border-black text-center" @dblclick="showAccount">{{account.firstname}}</td>
                    <td class="px-4 py-2 border border-black">
                        <div class="flex">
                            <button @click="showAccount" title="Show Details" 
                                class="w-full m-1 bg-gray-100 text-gray-700 hover:text-white hover:bg-blue-800 rounded-lg border border-blue-800"> 
                                <i class="inline fas fa-info text-lg"></i>
                            </button>
                            <button @click="editAccount" title="Edit Account" 
                                class="w-full m-1 bg-gray-100 text-gray-700 hover:text-white hover:bg-blue-800 rounded-lg border border-blue-800"> 
                                <i class="inline fas fa-pencil-alt text-lg"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    <div v-for="account in accounts" :key="account.username">
      <!-- show Account Object -->
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "AccountList",
  async setup() {
    //TODO get all accounts via API call + export "accounts" s.t. we can show them in the template

    //just for dev and designing
    let accounts = [
       {
            username:"bastihav",
            role: "Admin",  
            matNr: 69420,
            lastname: "Haverkamp",
            firstname: "Bastian"
       },
       {
            username:"tobiwie",
            role: "Admin",  
            matNr: 7033452,
            lastname: "Wiese",
            firstname: "Tobias"
       },
    ];

    function editAccount() {
        //TODO open edit account page
        console.log("Edit Me!")
    }

     function showAccount() {
          //TODO open account details page
        console.log("Show Me!")
    }
    return {
        accounts,
        editAccount,
        showAccount,
    };
  },
};
</script>
