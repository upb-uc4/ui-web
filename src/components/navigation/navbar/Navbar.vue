<template>
    <header class="lg:px-8 px-4 bg-white justify-between flex bg-gray-800 items-center lg:py-0 py-2 h-20">
        <div class="flex">
            <div class="flex items-center pr-8 mr-8 border-gray-100 border-r-4 my-2">
                <a href="#" class="flex text-3xl font-semibold text-gray-100 tracking-wider">
                    UC4
                </a>
            </div>

            <div class="w-auto items-center flex w-full">
                <nav>
                    <ul class="lg:flex items-center justify-between font-semibold text-gray-100 tracking-wider pt-4 lg:pt-0">
                        <li>
                            <a
                                class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 transition duration-500 ease-in-out"
                                href="#"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <course-menu
                                class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 transition duration-500 ease-in-out"
                            />
                        </li>
                        <li>
                            <a
                                class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 transition duration-500 ease-in-out"
                                href="#"
                            >Documentation</a>
                        </li>
                        <li>
                            <a
                                class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 lg:mb-0 mb-2 transition duration-500 ease-in-out"
                                href="#"
                            >Support</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <profile-menu />
    </header>
</template>

<script lang="ts">
    import ProfileMenu from "@/components/navigation/navbar/ProfileMenu.vue";
    import CourseMenu from "@/components/navigation/navbar/student/CoursesMenu/CourseMenu.vue";

    export default {
        name: "Navbar",
        components: {
            ProfileMenu,
            CourseMenu,
        },
    };
</script>
