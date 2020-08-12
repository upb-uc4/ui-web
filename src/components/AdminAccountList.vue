<template>
    <div class="w-full max-w-4xl">
        <div class="flex flex-col">
            <div class="flex flex-row w-full pt-2 mb-8">
                <seach-bar v-model:message="message" @refresh="refresh" />
                <router-link to="/createAccount" class="w-2/12 ml-4 w-">
                    <button title="Add a new User" class="flex flex-row items-center justify-center w-full p-2 btn-icon-green">
                        <p class="mr-3 text-lg font-semibold">Add</p>
                        <i class="inline text-lg fas fa-user-plus" />
                    </button>
                </router-link>
            </div>
            <role-filter v-model:selected-role="selectedRole" />
        </div>
        <accountList :key="refreshKey" :selected-role="selectedRole" />
        <div class="flex justify-center mt-16">
            <router-link to="/createAccount">
                <button id="addAccount" title="Add a new User" class="px-4 btn btn-green-primary-500">New Account</button>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import AccountList from "./AccountList.vue";
    import SeachBar from "./SearchBar.vue";
    import { ref } from "vue";
    import { Role } from "@/entities/Role";
    import RoleFilter from "./RoleFilter.vue";

    export default {
        name: "AdminAccountList",
        components: {
            AccountList,
            SeachBar,
            RoleFilter,
        },
        setup() {
            let message = ref("");
            let refreshKey = ref(false);

            let selectedRole = ref("All" as Role);

            function refresh() {
                refreshKey.value = !refreshKey.value;
            }
            return {
                refreshKey,
                refresh,
                message,
                selectedRole,
            };
        },
    };
</script>
