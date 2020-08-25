<template>
    <base-navbar>
        <li>
            <router-link :to="{ name: 'welcome' }" class="hover:bg-blue-800 rounded-lg mobile-navbar-menu">Home</router-link>
        </li>
        <li>
            <manage-accounts-menu id="nav_mobile_admin_menu_manage_accounts" class="mobile-navbar-menu" />
        </li>
        <li>
            <profile-menu class="nav_mobile_admin_menu_profile" />
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "@/components/navigation/navbar/mobile/common/BaseNavbar.vue";
    import ManageAccountsMenu from "./administration/ManageAccountsMenu.vue";
    import ProfileMenu from "@/components/navigation/navbar/mobile/common/profile/ProfileMenu.vue";

    export default {
        name: "MobileAdminNavbar",
        components: {
            BaseNavbar,
            ManageAccountsMenu,
            ProfileMenu,
        },
    };
</script>
