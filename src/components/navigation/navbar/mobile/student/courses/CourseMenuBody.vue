<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li>
                <menu-item
                    id="nav_mobile_student_menu_courses_all"
                    title="All Courses"
                    icon-class="fa-globe-americas"
                    target-route-name="student.courses"
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
