<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full px-2">
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item
                    title="All Users"
                    description="List of all users"
                    icon-class="fa-globe-americas"
                    target-route-name="admin.home"
                />
            </li>
            <li class="hover:bg-gray-200 rounded-lg p-2">
                <menu-item title="New Account" description="Create a new user" icon-class="fa-star" target-route-name="admin.home" />
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
