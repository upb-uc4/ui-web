<template>
    <div id="root" class="">
        <navbar />
        <div class="container mx-auto px-4">
            <router-view />
            <div id="modal-wrapper" />
            <div class="w-3/4 fixed bottom-0">
                <p class="text-xs text-right text-gray-700 mb-2 mr-2">Frontend Version {{ version }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Navbar from "@/components/navigation/navbar/Navbar.vue";

    export default {
        name: "App",
        components: {
            Navbar,
        },
        setup() {
            const version = "v" + process.env.VUE_APP_VERSION;
            return {
                version,
            };
        },
    };
</script>
