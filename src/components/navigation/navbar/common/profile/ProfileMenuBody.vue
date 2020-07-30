<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full px-2">
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item title="Profile" icon-class="fa-user" target-route-name="profile.private" :is-horizontally-aligned="true" />
            </li>
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item title="Settings" icon-class="fa-cog" target-route-name="settings" :is-horizontally-aligned="true" />
            </li>
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="Sign out"
                    icon-class="fa-sign-out-alt"
                    target-route-name="home"
                    :is-horizontally-aligned="true"
                    @click="logOut"
                />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "../../common/MenuItem.vue";
    import { useStore } from "../../../../../store/store";
    import { MutationTypes } from "../../../../../store/mutation-types";
    import Lecturer from "../../../../../api/api_models/user_management/Lecturer";
    import Admin from "../../../../../api/api_models/user_management/Admin";
    import Student from "../../../../../api/api_models/user_management/Student";
    import { Role } from "../../../../../entities/Role";

    export default {
        name: "ProfileMenuBody",
        components: {
            MenuItem,
        },
        setup() {
            function logOut() {
                const store = useStore();
                store.commit(MutationTypes.SET_LOGINDATA, { username: "", password: "" });
                store.commit(MutationTypes.SET_USER, {} as Student | Lecturer | Admin);
                store.commit(MutationTypes.SET_ROLE, Role.NONE);
                store.commit(MutationTypes.SET_LOGGEDIN, false);
            }

            return {
                logOut,
            };
        },
    };
</script>
