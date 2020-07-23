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
                <a href="#" class="navbar-menu">Others</a>
            </li>
        </ul>
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
