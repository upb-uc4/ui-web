<template>
    <base-navbar>
        <li>
            <router-link :to="{ name: 'lecturer.home' }" class="navbar-menu">Home</router-link>
        </li>
        <li>
            <course-menu class="navbar-menu" />
        </li>
        <template #right>
            <profile-menu class="pt-4" />
        </template>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "@/components/navigation/navbar/common/BaseNavbar.vue";
    import CourseMenu from "@/components/navigation/navbar/lecturer/courses/CourseMenu.vue";
    import ProfileMenu from "@/components/navigation/navbar/common/profile/ProfileMenu.vue";

    export default {
        name: "LecturerNavbar",
        components: {
            BaseNavbar,
            CourseMenu,
            ProfileMenu,
        },
    };
</script>
