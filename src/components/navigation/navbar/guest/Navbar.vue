<template>
    <base-navbar>
        <ul class="lg:flex items-center justify-between font-semibold text-gray-100 tracking-wider pt-4 lg:pt-0">
            <li>
                <a href="#" class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 transition duration-500 ease-in-out">
                    Some Welcome Stuff
                </a>
            </li>
        </ul>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "@/components/navigation/navbar/common/BaseNavbar.vue";

    export default {
        name: "LecturerNavbar",
        components: {
            BaseNavbar,
        },
    };
</script>
