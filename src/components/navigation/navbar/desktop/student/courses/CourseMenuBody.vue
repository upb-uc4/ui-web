<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full px-2">
            <li class="">
                <menu-item
                    id="nav_desktop_student_menu_courses_all"
                    title="All Courses"
                    description="Complete overview of all courses in your exam regulation"
                    icon-class="fas fa-list-alt"
                    target-route-name="student.courses"
                />
                <menu-item
                    id="nav_desktop_student_menu_courses_admitted"
                    title="My Courses"
                    description="Complete overview of your admitted courses"
                    icon-class="fas fa-list-alt"
                    target-route-name="student.my-courses"
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
