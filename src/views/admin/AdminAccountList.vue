<template>
    <div class="max-w-screen-lg mx-auto w-full">
        <div class="text-2xl text-center font-medium text-gray-800 mb-4">User Management</div>
        <div>
            <div class="flex flex-col-reverse md:flex-row items-center justify-between md:space-x-2 space-y-2 space-y-reverse md:space-y-0">
                <div class="w-full md:flex items-center md:space-x-2 space-y-2 md:space-y-0">
                    <div class="md:max-w-md w-full">
                        <seach-bar v-model:message="message" placeholder="Find a user..." @refresh="refresh" />
                    </div>
                    <div class="flex space-x-2">
                        <filter-select :elements="roles" label="Type" @update:selected="selectedRole = $event" />
                        <filter-select
                            :elements="status"
                            label="Status"
                            :default="selectedStatus"
                            @update:selected="selectedStatus = $event"
                        />
                    </div>
                </div>
                <router-link to="/createAccount" class="btn-add-tmp md:w-24 w-full flex items-center justify-center space-x-2">
                    <i class="fas fa-user-plus" />
                    <span class="font-semibold">New</span>
                </router-link>
            </div>
            <hr class="mt-4 mb-8" />
            <div class="">
                <accountList :key="refreshKey" :selected-role="selectedRole" :filter="message" :selected-status="selectedStatus" />
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
    import Select from "@/components/common/Select.vue";
    import { StatusFilter } from "@/entities/UserStatusFilter";

    export default {
        name: "AdminAccountList",
        components: {
            AccountList,
            SeachBar,
            FilterSelect: Select,
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
            let roles = Object.values(Role).filter((role) => role != Role.NONE);
            roles.unshift("All" as Role);

            let status = Object.values(StatusFilter);
            let selectedStatus = ref(status[1]);
            let message = ref("");
            let refreshKey = ref(false);
            let selectedRole = ref(roles[0]);
            let showInactive = ref(false);

            function refresh() {
                refreshKey.value = !refreshKey.value;
            }

            return {
                roles,
                status,
                refreshKey,
                refresh,
                message,
                selectedRole,
                selectedStatus,
                showInactive,
            };
        },
    };
</script>
