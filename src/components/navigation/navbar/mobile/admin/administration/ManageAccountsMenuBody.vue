<template>
    <section class="flex flex-col px-4 py-3">
        <ul class="w-full px-2">
            <li class="cursor-pointer mb-4 rounded-lg">
                <menu-item
                    title="All Users"
                    description="List of all users"
                    icon-class="fa-globe-americas"
                    target-route-name="accountlist"
                />
            </li>
            <li class="cursor-pointer rounded-lg">
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
    import MenuItem from "@/components/navigation/navbar/mobile/common/MenuItem.vue";

    export default {
        name: "CourseMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
