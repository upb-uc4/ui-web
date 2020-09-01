<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full lg:w-1/2 px-2">
            <li class="cursor-pointer mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="All Courses"
                    description="Overview of all courses"
                    icon-class="fa-globe-americas"
                    target-route-name="lecturer.courses"
                />
            </li>
            <li class="cursor-pointer mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="Create Course"
                    description="Create a new course"
                    icon-class="fa-star"
                    target-route-name="courseForm.create"
                />
            </li>
        </ul>
        <ul class="w-full lg:w-1/2 px-4">
            <li class="cursor-pointer hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="My Courses"
                    description="Courses you created"
                    icon-class="fa-meteor"
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
