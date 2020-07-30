<template>
    <div class="w-full lg:mt-16 mt-8 bg-gray-300 mx-auto h-screen">
        <button id="navigateBack" class="flex items-center mb-4 navigation-link" @click="back">
            <i class="fas text-xl fa-chevron-left" />
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8">Settings</h1>

        <div>
            <security-section />
        </div>
    </div>
</template>

<script>
    import SecuritySection from "@/components/settings/SecuritySection";
    import Router from "@/router";

    export default {
        name: "Settings",
        components: {
            SecuritySection,
        },
        setup() {
            function back() {
                Router.back();
            }
            return { back };
        },
    };
</script>
