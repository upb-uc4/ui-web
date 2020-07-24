<template>
    <section class="flex flex-col lg:flex-row px-8 py-6 border-b -mx-4">
        <ul class="w-full px-2">
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item title="Profile" icon-class="fa-user" target-route-name="home" :is-horizontally-aligned="true" />
            </li>
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item title="Settings" icon-class="fa-cog" target-route-name="home" :is-horizontally-aligned="true" />
            </li>
            <li class="mb-4 hover:bg-gray-200 rounded-lg p-2">
                <menu-item title="Sign out" icon-class="fa-sign-out-alt" target-route-name="home" :is-horizontally-aligned="true" />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "../../common/MenuItem.vue";

    export default {
        name: "ProfileMenuBody",
        components: {
            MenuItem,
        },
    };
</script>
