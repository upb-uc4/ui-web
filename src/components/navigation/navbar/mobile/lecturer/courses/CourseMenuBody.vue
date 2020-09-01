<template>
    <section class="flex flex-col px-2 pt-3 pb-1">
        <ul class="w-full px-2">
            <li class="cursor-pointer mb-2 rounded-lg p-2 hover:bg-blue-800">
                <menu-item
                    id="nav_mobile_lecturer_menu_courses_all"
                    title="All Courses"
                    icon-class="fa-globe-americas"
                    target-route-name="lecturer.courses"
                />
            </li>
            <li class="cursor-pointer mb-2 rounded-lg p-2 hover:bg-blue-800">
                <menu-item
                    id="nav_mobile_lecturer_menu_courses_create"
                    title="Create Course"
                    icon-class="fa-star"
                    target-route-name="courseForm.create"
                />
            </li>
            <li class="cursor-pointer rounded-lg p-2 hover:bg-blue-800">
                <menu-item
                    id="nav_mobile_lecturer_menu_courses_my_courses"
                    title="My Courses"
                    icon-class="fa-meteor"
                    target-route-name="lecturer.courses"
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
