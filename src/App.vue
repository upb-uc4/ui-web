<template>
    <div id="root" class="container mx-auto px-4">
        <router-view />
        <div id="modal-wrapper" />
        <div class="w-3/4 fixed bottom-0">
            <p class="text-xs text-right text-gray-700 mb-2 mr-2">Frontend Version {{ version }}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { store } from "@/store/store";

    export default {
        name: "App",
        components: {},
        setup() {
            const version = "v" + process.env.VUE_APP_VERSION;
            return {
                version,
            };
        },
    };
</script>
