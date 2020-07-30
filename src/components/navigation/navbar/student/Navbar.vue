<template>
    <base-navbar>
        <li>
            <a href="#" class="navbar-menu">Home</a>
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
    import CourseMenu from "@/components/navigation/navbar/student/courses/CourseMenu.vue";
    import ProfileMenu from "@/components/navigation/navbar/common/profile/ProfileMenu.vue";

    export default {
        name: "AdminNavbar",
        components: {
            BaseNavbar,
            CourseMenu,
            ProfileMenu,
        },
    };
</script>
