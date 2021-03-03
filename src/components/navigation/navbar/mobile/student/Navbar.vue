<template>
    <base-navbar>
        <li>
            <router-link :to="{ name: 'welcome' }" class="hover:bg-blue-800 rounded-lg mobile-navbar-menu">Home</router-link>
        </li>
        <li>
            <course-menu id="nav_mobile_student_menu_courses" class="mobile-navbar-menu" />
        </li>
        <li>
            <exam-menu id="nav_mobile_student_menu_exam" class="mobile-navbar-menu" />
        </li>
        <li>
            <study-menu id="nav_mobile_student_menu_study" class="mobile-navbar-menu" />
        </li>
        <li>
            <profile-menu class="nav_mobile_menu_profile mobile-navbar-menu" />
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "../common/BaseNavbar.vue";
    import CourseMenu from "./courses/CourseMenu.vue";
    import StudyMenu from "./study/StudyMenu.vue";
    import ProfileMenu from "../common/profile/ProfileMenu.vue";
    import ExamMenu from "./exams/ExamsMenu.vue";

    export default {
        name: "MobileStudentNavbar",
        components: {
            BaseNavbar,
            CourseMenu,
            ProfileMenu,
            StudyMenu,
            ExamMenu,
        },
    };
</script>
