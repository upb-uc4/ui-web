<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full lg:w-1/2 px-2">
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="All Courses"
                    description="Complete overview of all courses"
                    icon-class="fa-globe-americas"
                    target-route-name="student.home"
                />
            </li>
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="Favorite Courses"
                    description="All courses you marked as favorite"
                    icon-class="fa-star"
                    target-route-name="home"
                />
            </li>
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="Active Courses"
                    description="Courses you are currently enrolled in"
                    icon-class="fa-users"
                    target-route-name="home"
                />
            </li>
        </ul>
        <ul class="w-full lg:w-1/2 px-4">
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="My Courses"
                    description="All courses you ever participated in"
                    icon-class="fa-meteor"
                    target-route-name="home"
                />
            </li>
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="Organisational Stuff"
                    description="Probably meant to click this one"
                    icon-class="fa-sitemap"
                    target-route-name="home"
                />
            </li>
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item title="Play Chess" description="Check mate" icon-class="fa-chess-knight" target-route-name="home" />
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
