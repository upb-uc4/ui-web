<template>
    <base-navbar>
        <li>
            <router-link id="routeLogin" :to="{ name: 'login' }" class="hover:bg-blue-800 rounded-lg mobile-navbar-menu">Login</router-link>
        </li>
        <li>
            <manage-accounts-menu class="mobile-navbar-menu" />
        </li>
        <li>
            <profile-menu class="mobile-navbar-menu" />
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "@/components/navigation/navbar/mobile/common/BaseNavbar.vue";
    import ManageAccountsMenu from "./administration/ManageAccountsMenu.vue";
    import ProfileMenu from "@/components/navigation/navbar/mobile/common/profile/ProfileMenu.vue";

    export default {
        name: "MobileGuestNavbar",
        components: {
            BaseNavbar,
            ManageAccountsMenu,
            ProfileMenu,
        },
    };
</script>
