<template>
    <base-navbar>
        <li>
            <a href="#" class="navbar-menu">Some Welcome Stuff</a>
        </li>
    </base-navbar>
</template>

<script lang="ts">
    import BaseNavbar from "../common/BaseNavbar.vue";

    export default {
        name: "LecturerNavbar",
        components: {
            BaseNavbar,
        },
    };
</script>
