<template>
    <base-navbar>
        <li>
            <router-link :to="{ name: 'welcome' }" class="hover:bg-blue-800 rounded-lg mobile-navbar-menu">Home</router-link>
        </li>
        <li>
            <course-menu id="nav_mobile_lecturer_menu_courses" class="mobile-navbar-menu" />
        </li>
        <li>
            <exams-menu id="nav_mobile_lecturer_menu_exams" class="mobile-navbar-menu" />
        </li>
        <li>
            <profile-menu class="nav_mobile_menu_profile mobile-navbar-menu" />
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "../common/BaseNavbar.vue";
    import CourseMenu from "./courses/CourseMenu.vue";
    import ExamsMenu from "./exams/ExamsMenu.vue";
    import ProfileMenu from "../common/profile/ProfileMenu.vue";

    export default {
        name: "MobileLecturerNavbar",
        components: {
            BaseNavbar,
            CourseMenu,
            ExamsMenu,
            ProfileMenu,
        },
    };
</script>
