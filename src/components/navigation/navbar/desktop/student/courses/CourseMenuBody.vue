<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 -mx-4">
        <ul class="w-full px-2">
            <li class="">
                <menu-item
                    id="nav_desktop_student_menu_courses_all"
                    title="Enroll in courses"
                    description="Courses you can enroll in"
                    icon-class="fas fa-vote-yea"
                    target-route-name="student.courses"
                />
                <menu-item
                    id="nav_desktop_student_menu_courses_admitted"
                    title="My Courses"
                    description="Courses you are enrolled in"
                    icon-class="fas fa-bookmark"
                    target-route-name="student.my-courses"
                />
                <menu-item
                    id="nav_desktop_student_menu_course_catalog"
                    title="Course Catalog"
                    description="All courses at your university"
                    icon-class="fas fa-list-alt"
                    target-route-name="courseCatalog"
                />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "../../common/MenuItem.vue";

    export default {
        name: "CourseMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
