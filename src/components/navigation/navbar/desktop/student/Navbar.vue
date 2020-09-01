<template>
    <base-navbar>
        <li>
            <router-link :to="{ name: 'welcome' }" class="navbar-menu">Home</router-link>
        </li>
        <li>
            <course-menu id="nav_desktop_student_menu_courses" class="navbar-menu" />
        </li>
        <template #right>
            <profile-menu class="pt-4" />
        </template>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "../common/BaseNavbar.vue";
    import CourseMenu from "./courses/CourseMenu.vue";
    import ProfileMenu from "../common/profile/ProfileMenu.vue";

    export default {
        name: "AdminNavbar",
        components: {
            BaseNavbar,
            CourseMenu,
            ProfileMenu,
        },
    };
</script>
