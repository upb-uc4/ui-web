<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full px-2">
            <li class="mb-4">
                <menu-item
                    title="All Courses"
                    description="Overview of all courses"
                    icon-class="fa-globe-americas"
                    target-route-name="shared.courses"
                />
            </li>
            <li>
                <menu-item
                    title="Create Course"
                    description="Create a new course"
                    icon-class="fa-star"
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
