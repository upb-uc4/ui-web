<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 -mx-4">
        <ul class="w-full px-2 space-y-4">
            <li class="">
                <menu-item
                    id="nav_desktop_profile"
                    title="Profile"
                    icon-class="fa-user"
                    target-route-name="profile.private"
                    :is-horizontally-aligned="true"
                />
            </li>
            <li class="">
                <menu-item
                    id="nav_desktop_settings"
                    title="Settings"
                    icon-class="fa-cog"
                    target-route-name="settings"
                    :is-horizontally-aligned="true"
                />
            </li>
            <li class="">
                <menu-item
                    id="nav_desktop_logout"
                    title="Sign out"
                    icon-class="fa-sign-out-alt"
                    :is-horizontally-aligned="true"
                    :action="logout"
                />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "../MenuItem.vue";
    import { logout } from "@/use/helpers/Logout";

    export default {
        name: "ProfileMenuBody",
        components: {
            MenuItem,
        },
        setup() {
            return {
                logout,
            };
        },
    };
</script>
