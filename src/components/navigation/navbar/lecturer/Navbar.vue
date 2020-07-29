<template>
    <base-navbar>
        <li>
            <a href="#" class="navbar-menu">Home</a>
        </li>
        <li>
            <course-menu class="navbar-menu" />
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "@/components/navigation/navbar/common/BaseNavbar.vue";
    import CourseMenu from "@/components/navigation/navbar/student/CoursesMenu/CourseMenu.vue";

    export default {
        name: "LecturerNavbar",
        components: {
            BaseNavbar,
            CourseMenu,
        },
    };
</script>
