<template>
    <base-navbar>
        <ul class="lg:flex items-center justify-between font-semibold text-gray-100 tracking-wider pt-4 lg:pt-0">
            <li>
                <a href="#" class="navbar-menu">Home</a>
            </li>
            <li>
                <course-menu class="navbar-menu" />
            </li>
            <li>
                <a href="#" class="navbar-menu">Documentation</a>
            </li>
            <li>
                <a href="#" class="navbar-menu">Support</a>
            </li>
        </ul>
        <template #right>
            <profile-menu class="pt-4" />
        </template>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "@/components/navigation/navbar/common/BaseNavbar.vue";
    import CourseMenu from "@/components/navigation/navbar/student/CoursesMenu/CourseMenu.vue";
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
