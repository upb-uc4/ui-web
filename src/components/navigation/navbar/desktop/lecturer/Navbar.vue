<template>
    <base-navbar>
        <li>
            <router-link :to="{ name: 'welcome' }" class="navbar-menu">Home</router-link>
        </li>
        <li>
            <course-menu id="nav_desktop_lecturer_menu_courses" class="navbar-menu" />
        </li>
        <li>
            <exams-menu id="nav_desktop_lecturer_menu_exams" class="navbar-menu" />
        </li>
        <template #right>
            <profile-menu id="menu_profile" class="pt-4" />
        </template>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "../common/BaseNavbar.vue";
    import CourseMenu from "./courses/CourseMenu.vue";
    import ExamsMenu from "./exams/ExamsMenu.vue";
    import ProfileMenu from "../common/profile/ProfileMenu.vue";

    export default {
        name: "LecturerNavbar",
        components: {
            BaseNavbar,
            CourseMenu,
            ExamsMenu,
            ProfileMenu,
        },
    };
</script>
