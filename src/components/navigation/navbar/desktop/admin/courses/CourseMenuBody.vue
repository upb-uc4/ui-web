<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full px-2">
            <li class="mb-4">
                <menu-item
                    id="nav_desktop_admin_menu_courses_all"
                    title="All Courses"
                    description="Overview of all courses"
                    icon-class="fas fa-list-alt"
                    target-route-name="shared.courses"
                />
            </li>
            <li>
                <menu-item
                    id="nav_desktop_admin_menu_courses_create"
                    title="Create Course"
                    description="Create a new course"
                    icon-class="fas fa-calendar-plus"
                    target-route-name="courseForm.create"
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
