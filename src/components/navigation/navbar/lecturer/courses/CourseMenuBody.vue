<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full lg:w-1/2 px-2">
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="All Courses"
                    description="Overview of all courses"
                    icon-class="fa-globe-americas"
                    target-route-name="lecturer.home"
                />
            </li>
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="Course Drafts"
                    description="Continue to work on your drafts"
                    icon-class="fa-star"
                    target-route-name="lecturer.home"
                />
            </li>
        </ul>
        <ul class="w-full lg:w-1/2 px-4">
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="Created Course"
                    description="Courses you created"
                    icon-class="fa-meteor"
                    target-route-name="lecturer.home"
                />
            </li>
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item title="Organisational Stuff" description="Stuff" icon-class="fa-sitemap" target-route-name="lecturer.home" />
            </li>
        </ul>
    </section>
</template>

<script>
    import MenuItem from "../../common/MenuItem";

    export default {
        name: "CourseMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
