<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li class="mb-2">
                <menu-item
                    id="nav_mobile_lecturer_menu_courses_all"
                    title="All Courses"
                    icon-class="fas fa-list-alt"
                    target-route-name="shared.courses"
                />
            </li>
            <li class="mb-2">
                <menu-item
                    id="nav_mobile_lecturer_menu_courses_create"
                    title="Create Course"
                    icon-class="fas fa-calendar-plus"
                    target-route-name="courseForm.create"
                />
            </li>
            <li>
                <menu-item
                    id="nav_mobile_lecturer_menu_courses_my_courses"
                    title="My Courses"
                    icon-class="fas fa-list-alt"
                    target-route-name="lecturer.myCourses"
                />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "../../common/MenuItem.vue";

    export default {
        name: "MobileLecturerCourseMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
