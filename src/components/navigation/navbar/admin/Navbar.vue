<template>
    <base-navbar>
        <li>
            <a href="#" class="navbar-menu">Home</a>
        </li>
        <li>
            <course-menu class="navbar-menu" />
        </li>
        <li>
            <a href="#" class="navbar-menu">Others</a>
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "@/components/navigation/navbar/common/BaseNavbar.vue";
    import CourseMenu from "@/components/navigation/navbar/student/CoursesMenu/CourseMenu.vue";

    export default {
        name: "AdminNavbar",
        components: {
            BaseNavbar,
            CourseMenu,
        },
    };
</script>
