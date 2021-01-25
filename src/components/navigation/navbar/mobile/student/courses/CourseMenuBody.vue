<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li>
                <menu-item
                    id="nav_mobile_student_menu_courses_all"
                    title="Enroll in courses"
                    icon-class="fas fa-vote-yea"
                    target-route-name="student.courses"
                />
                <menu-item
                    id="nav_mobile_student_menu_courses_admitted"
                    title="My Courses"
                    icon-class="fas fa-bookmark"
                    target-route-name="student.my-courses"
                />
                <menu-item
                    id="nav_desktop_student_menu_course_catalog"
                    title="Course Catalog"
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
        name: "MobileStudentCourseMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
