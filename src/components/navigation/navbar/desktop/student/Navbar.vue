<template>
    <base-navbar>
        <li>
            <router-link :to="{ name: 'welcome' }" class="navbar-menu">Home</router-link>
        </li>
        <li>
            <course-menu id="nav_desktop_student_menu_courses" class="navbar-menu" />
        </li>
        <li>
            <exam-menu id="nav_desktop_student_menu_exams" class="navbar-menu" />
        </li>
        <li>
            <study-menu id="nav_desktop_student_menu_study" class="navbar-menu" />
        </li>
        <template #right>
            <profile-menu id="menu_profile" class="pt-4" />
        </template>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "../common/BaseNavbar.vue";
    import CourseMenu from "./courses/CourseMenu.vue";
    import StudyMenu from "./study/StudyMenu.vue";
    import ProfileMenu from "../common/profile/ProfileMenu.vue";
    import ExamMenu from "./exams/ExamsMenu.vue";

    export default {
        name: "StudentNavbar",
        components: {
            BaseNavbar,
            CourseMenu,
            ProfileMenu,
            StudyMenu,
            ExamMenu,
        },
    };
</script>
