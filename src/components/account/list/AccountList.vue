<template>
    <div v-if="busy">
        <loading-spinner />
    </div>
    <div v-else class="flex flex-col bg-white rounded-lg shadow">
        <div v-for="(user, index) in shownUsers" :key="user">
            <user-row :user="user" :is-first-row="index === 0" :is-last-row="index === shownUsers.length - 1" />
        </div>
    </div>
</template>

<script lang="ts">
    import UserManagement from "@/api/UserManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import UserRow from "./UserRow.vue";
    import { Role } from "@/entities/Role";
    import { computed, ref, onBeforeMount, watch } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import User from "@/api/api_models/user_management/User";
    import { StatusFilter } from "@/entities/UserStatusFilter";

    export default {
        name: "AccountList",
        components: {
            UserRow,
            LoadingSpinner,
        },
        props: {
            selectedRole: {
                type: String,
                required: true,
            },
            filter: {
                type: String,
                required: true,
            },
            selectedStatus: {
                type: String,
                required: true,
            },
        },
        emits: ["on-updated"],
        setup(props: any, { emit }: any) {
            let busy = ref(false);
            let users = ref([] as User[]);

            onBeforeMount(async () => {
                await getUsers();
            });

            watch(
                () => props.selectedStatus,
                () => {
                    getUsers();
                }
            );

            async function getUsers() {
                busy.value = true;
                const userManagement: UserManagement = new UserManagement();
                const genericResponseHandler = new GenericResponseHandler("users");
                let response;
                switch (props.selectedStatus) {
                    case StatusFilter.ACTIVE:
                        response = await userManagement.getUsers(undefined, undefined, true);
                        break;
                    case StatusFilter.INACTIVE:
                        response = await userManagement.getUsers(undefined, undefined, false);
                        break;
                    default:
                        response = await userManagement.getUsers();
                        break;
                }
                const userLists = genericResponseHandler.handleResponse(response);
                users.value = Object.values(userLists).flat();
                busy.value = false;
            }

            let shownUsers = computed(() => {
                let filteredUsers =
                    props.selectedRole == ("All" as Role) ? users.value : users.value.filter((e) => e.role == props.selectedRole);
                if (props.filter != "") {
                    let filter = props.filter.toLowerCase();
                    filteredUsers = filteredUsers.filter(
                        (e) =>
                            e.firstName.toLowerCase().includes(filter) ||
                            e.lastName.toLowerCase().includes(filter) ||
                            e.username.toLowerCase().includes(filter)
                    );
                }
                emit("on-updated", filteredUsers.length);
                return filteredUsers;
            });

            return {
                shownUsers,
                busy,
            };
        },
    };
</script>
