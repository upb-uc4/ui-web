<template>
    <section class="bg-gray-100 px-2 py-4">
        <ul>
            <li class="mb-4 hover:bg-gray-300 rounded-lg p-4">
                <menu-item
                    title="Roko's Basilisk"
                    description="Hail dear mighty creature"
                    icon-class="fa-dragon"
                    target-route-name="home"
                    :is-horizontally-aligned="true"
                />
            </li>
            <li class="mb-4 hover:bg-gray-300 rounded-lg p-4">
                <menu-item
                    title="Hit the road, Jack"
                    description="Don't you come back no more"
                    icon-class="fa-road"
                    target-route-name="home"
                    :is-horizontally-aligned="true"
                />
            </li>
            <li class="hover:bg-gray-300 rounded-lg p-4">
                <menu-item
                    title="Lift Weights"
                    description="Get big and strong"
                    icon-class="fa-dumbbell"
                    target-route-name="home"
                    :is-horizontally-aligned="true"
                />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
    import MenuItem from "@/components/navigation/navbar/common/MenuItem.vue";

    export default {
        name: "CourseMenuFooter",
        components: {
            MenuItem,
        },
    };
</script>
