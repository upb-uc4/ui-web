<template>
    <base-navbar>
        <ul class="lg:flex items-center justify-between font-semibold text-gray-100 tracking-wider pt-4 lg:pt-0">
            <li>
                <a href="#" class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 transition duration-500 ease-in-out">
                    Home
                </a>
            </li>
            <li>
                <course-menu
                    class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 transition duration-500 ease-in-out"
                />
            </li>
            <li>
                <a href="#" class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 transition duration-500 ease-in-out">
                    Documentation
                </a>
            </li>
            <li>
                <a href="#" class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 transition duration-500 ease-in-out">
                    Support
                </a>
            </li>
        </ul>
        <template #right>
            <profile-menu class="pt-4" />
        </template>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "@/components/navigation/navbar/common/BaseNavbar.vue";
    import CourseMenu from "@/components/navigation/navbar/student/CoursesMenu/CourseMenu.vue";
    import ProfileMenu from "@/components/navigation/navbar/common/profile/ProfileMenu.vue";

    export default {
        name: "AdminNavbar",
        components: {
            BaseNavbar,
            CourseMenu,
            ProfileMenu,
        },
    };
</script>
