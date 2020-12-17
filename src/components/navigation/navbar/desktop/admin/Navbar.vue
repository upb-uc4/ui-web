<template>
    <base-navbar>
        <li>
            <router-link :to="{ name: 'welcome' }" class="navbar-menu">Home</router-link>
        </li>
        <li>
            <manage-accounts-menu id="nav_desktop_admin_menu_manage_accounts" class="navbar-menu" />
        </li>
        <li>
            <course-menu id="nav_desktop_admin_menu_courses" class="navbar-menu" />
        </li>
        <template #right>
            <profile-menu id="menu_profile" class="pt-4" />
        </template>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "../common/BaseNavbar.vue";
    import ManageAccountsMenu from "./administration/ManageAccountsMenu.vue";
    import CourseMenu from "./courses/CourseMenu.vue";
    import ProfileMenu from "../common/profile/ProfileMenu.vue";

    export default {
        name: "AdminNavbar",
        components: {
            BaseNavbar,
            ManageAccountsMenu,
            CourseMenu,
            ProfileMenu,
        },
    };
</script>
