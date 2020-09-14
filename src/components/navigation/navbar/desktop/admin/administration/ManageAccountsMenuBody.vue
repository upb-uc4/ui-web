<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full px-2">
            <li class="mb-4">
                <menu-item
                    title="All Users"
                    description="List of all users"
                    icon-class="fa-globe-americas"
                    target-route-name="accountlist"
                />
            </li>
            <li>
                <menu-item
                    title="New Account"
                    description="Create a new user"
                    icon-class="fa-star"
                    target-route-name="accountForm.create"
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
