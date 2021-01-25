<template>
    <button id="navigateBack" class="flex items-center mb-4 navigation-link">
        <i class="text-xl fas fa-chevron-left" />
        <span class="ml-1 text-sm font-bold" @click="onBackButtonPressed">{{ backButtonText }}</span>
    </button>
    <h1 class="mb-6 text-2xl font-medium text-gray-800 dark:text-gray-300">{{ title }}</h1>
</template>

<script lang="ts">
    import Router from "@/use/router";

    export default {
        name: "SectionHeader",
        props: {
            title: {
                type: String,
                required: true,
            },
            backButtonText: {
                type: String,
                default: "Back",
            },
            onBackButtonPressed: {
                type: Function,
                default: () => {
                    Router.back();
                },
            },
        },
    };
</script>
