<template>
    <div class="mt-12 sm:mt-32 text-4xl text-center font-semibold text-gray-900">Available Accounts</div>
    <div class="sm:mt-8 flex justify-center">
        <div class="w-full max-w-4xl">
            <div class="flex flex-col">
                <div class="flex sm:flex-row flex-col-reverse w-full">
                    <seach-bar v-model:message="message" class="sm:mr-4" @refresh="refresh" />

                    <router-link
                        to="/createAccount"
                        class="flex flex-row items-center justify-center mb-4 sm:mb-0 sm:w-32 w-full border-2 rounded-lg border-gray-300 h-12 px-12 btn-green-primary-500"
                    >
                        <p class="mr-3 font-semibold">Add</p>
                        <i class="fas fa-user-plus" />
                    </router-link>
                </div>

                <role-filter v-model:selected-role="selectedRole" />
            </div>
            <accountList :key="refreshKey" :selected-role="selectedRole" :filter="message" />
            <div class="flex justify-center mt-16">
                <router-link to="/createAccount">
                    <button id="addAccount" title="Add a new User" class="px-4 btn btn-green-primary-500">New Account</button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import AccountList from "@/components/account/list/AccountList.vue";
    import { checkPrivilege } from "@/use/helpers/PermissionHelper";
    import SeachBar from "@/components/common/SearchBar.vue";
    import { ref } from "vue";
    import { Role } from "@/entities/Role";
    import RoleFilter from "@/components/account/list/RoleFilter.vue";

    export default {
        name: "AdminAccountList",
        components: {
            AccountList,
            SeachBar,
            RoleFilter,
        },

        async beforeRouteEnter(_to: any, _from: any, next: any) {
            const response = await checkPrivilege(Role.ADMIN);

            if (response.allowed) {
                return next();
            }
            if (!response.authenticated) {
                return next("/login");
            }

            return next("/redirect");
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
