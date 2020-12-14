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
                        <filter-select :elements="roles" label="Type" :default="selectedRole" @update:selected="selectedRole = $event" />
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
            <hr class="my-4" />
            <div v-show="isFiltering()" class="text-gray-800 text-sm">
                <div class="flex justify-between">
                    <div>
                        <div v-if="isFilteringRole() && isFilteringStatus()">
                            <span class="font-semibold">{{ matchingUsersCount }}</span> results for
                            <span class="font-semibold">{{ selectedRole.toLowerCase() }}</span> users who are
                            <span class="font-semibold">{{ selectedStatus.toLowerCase() }}</span>
                            <span v-if="isFilteringBySearch()">
                                matching
                                <span class="font-semibold">{{ message }}.</span>
                            </span>
                            <span v-else>.</span>
                        </div>
                        <div v-else-if="isFilteringRole()">
                            <span class="font-semibold">{{ matchingUsersCount }}</span> results for
                            <span class="font-semibold">{{ selectedRole.toLowerCase() }}</span> users
                            <span v-if="isFilteringBySearch()">
                                matching
                                <span class="font-semibold">{{ message }}.</span>
                            </span>
                            <span v-else>.</span>
                        </div>
                        <div v-else-if="isFilteringStatus()">
                            <span class="font-semibold">{{ matchingUsersCount }}</span> results for
                            <span class="font-semibold">{{ selectedStatus.toLowerCase() }}</span> users
                            <span v-if="isFilteringBySearch()">
                                matching
                                <span class="font-semibold">{{ message }}.</span>
                            </span>
                            <span v-else>.</span>
                        </div>
                        <div v-else>
                            <span class="font-semibold">{{ matchingUsersCount }}</span> results matching
                            <span class="font-semibold">{{ message }}</span>.
                        </div>
                    </div>
                    <div class="btn-tertiary-tmp" @click="clearFilter()">Clear filter</div>
                </div>
                <hr class="mt-4 mb-8" />
            </div>
            <div>
                <accountList
                    :key="refreshKey"
                    :selected-role="selectedRole"
                    :filter="message"
                    :selected-status="selectedStatus"
                    @on-updated="matchingUsersCount = $event"
                />
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
            const matchingUsersCount = ref(0);
            let roles = Object.values(Role).filter((role) => role != Role.NONE);
            roles.unshift("All" as Role);
            const defaultRole = roles[0];
            let selectedRole = ref(defaultRole);

            let status = Object.values(StatusFilter);
            const defaultStatus = status[0];
            let selectedStatus = ref(defaultStatus);

            let message = ref("");
            let refreshKey = ref(false);
            let showInactive = ref(false);

            function refresh() {
                refreshKey.value = !refreshKey.value;
            }

            function isFilteringBySearch() {
                return message.value !== "";
            }

            function isFilteringRole() {
                return selectedRole.value !== defaultRole;
            }

            function isFilteringStatus() {
                return selectedStatus.value !== defaultStatus;
            }

            function isFiltering() {
                return isFilteringBySearch() || isFilteringRole() || isFilteringStatus();
            }

            function clearFilter() {
                //TODO reset selects. OR model them as v-model
                message.value = "";
                selectedStatus.value = defaultStatus;
                selectedRole.value = defaultRole;
            }

            return {
                matchingUsersCount,
                roles,
                status,
                refreshKey,
                refresh,
                message,
                selectedRole,
                selectedStatus,
                showInactive,
                isFiltering,
                isFilteringRole,
                isFilteringStatus,
                isFilteringBySearch,
                clearFilter,
            };
        },
    };
</script>
