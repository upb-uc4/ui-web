<template>
    <base-navbar>
        <li>
            <router-link :to="{ name: 'welcome' }" class="hover:bg-blue-800 rounded-lg mobile-navbar-menu">Home</router-link>
        </li>
        <li>
            <course-menu id="mobile_menu_courses" class="mobile-navbar-menu" />
        </li>
        <li>
            <profile-menu class="mobile-navbar-menu" />
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "../common/BaseNavbar.vue";
    import CourseMenu from "./courses/CourseMenu.vue";
    import ProfileMenu from "../common/profile/ProfileMenu.vue";

    export default {
        name: "MobileLecturerNavbar",
        components: {
            BaseNavbar,
            CourseMenu,
            ProfileMenu,
        },
    };
</script>
