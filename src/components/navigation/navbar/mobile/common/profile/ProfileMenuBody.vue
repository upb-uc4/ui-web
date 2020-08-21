<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li class="cursor-pointer mb-2 rounded-lg p-2 hover:bg-blue-800">
                <menu-item title="Profile" icon-class="fa-user" target-route-name="profile.private" />
            </li>
            <li class="cursor-pointer mb-2 rounded-lg p-2 hover:bg-blue-800">
                <menu-item title="Settings" icon-class="fa-cog" target-route-name="settings" />
            </li>
            <li class="cursor-pointer rounded-lg p-2 hover:bg-blue-800">
                <menu-item
                    title="Sign out"
                    description="Create a new user"
                    icon-class="fa-sign-out-alt"
                    target-route-name="home"
                    @click="logOut"
                />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "../MenuItem.vue";
    import { useStore } from "@/store/store";
    import { MutationTypes } from "@/store/mutation-types";
    import Lecturer from "../../../../../../api/api_models/user_management/Lecturer";
    import Admin from "../../../../../../api/api_models/user_management/Admin";
    import Student from "../../../../../../api/api_models/user_management/Student";
    import { Role } from "@/entities/Role";

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
