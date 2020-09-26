<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li class="mb-2">
                <menu-item id="nav_mobile_profile" title="Profile" icon-class="fa-user" target-route-name="profile.private" />
            </li>
            <li class="mb-2">
                <menu-item id="nav_mobile_settings" title="Settings" icon-class="fa-cog" target-route-name="settings" />
            </li>
            <li>
                <menu-item id="nav_mobile_logout" title="Sign out" icon-class="fa-sign-out-alt" :action="logout" />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "../MenuItem.vue";
    import { logout } from "@/use/helpers/Logout";

    export default {
        name: "MobileProfileMenuBody",
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
