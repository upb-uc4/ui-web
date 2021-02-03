<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 -mx-4">
        <ul class="w-full lg:w-1/2 px-2 space-y-4">
            <li>
                <menu-item
                    id="nav_desktop_lecturer_menu_courses_all"
                    title="All Courses"
                    description="Overview of all courses"
                    icon-class="fas fa-list-alt"
                    target-route-name="shared.courses"
                />
            </li>
            <li>
                <menu-item
                    id="nav_desktop_lecturer_menu_courses_create"
                    title="Create Course"
                    description="Create a new course"
                    icon-class="fas fa-calendar-plus"
                    target-route-name="courseForm.create"
                />
            </li>
        </ul>
        <ul class="w-full lg:w-1/2 px-4 space-y-4">
            <li>
                <menu-item
                    id="nav_desktop_lecturer_menu_courses_my_courses"
                    title="My Courses"
                    description="Courses you created"
                    icon-class="fas fa-bookmark"
                    target-route-name="lecturer.myCourses"
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
