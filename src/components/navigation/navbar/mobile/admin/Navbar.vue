<template>
    <base-navbar>
        <li>
            <router-link :to="{ name: 'welcome' }" class="hover:bg-blue-800 rounded-lg mobile-navbar-menu">Home</router-link>
        </li>
        <li>
            <manage-accounts-menu id="nav_mobile_admin_menu_manage_accounts" class="mobile-navbar-menu" />
        </li>
        <li>
            <course-menu id="nav_mobile_admin_menu_courses" class="mobile-navbar-menu" />
        </li>
        <li>
            <profile-menu class="nav_mobile_menu_profile mobile-navbar-menu" />
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "@/components/navigation/navbar/mobile/common/BaseNavbar.vue";
    import ManageAccountsMenu from "./administration/ManagementMenu.vue";
    import CourseMenu from "./courses/CourseMenu.vue";
    import ProfileMenu from "@/components/navigation/navbar/mobile/common/profile/ProfileMenu.vue";

    export default {
        name: "MobileAdminNavbar",
        components: {
            BaseNavbar,
            ManageAccountsMenu,
            CourseMenu,
            ProfileMenu,
        },
    };
</script>
