<template>
    <div class="mt-10 items-center justify-center flex flex-col space-y-4">
        <img src="@/assets/loading-spinner-alt.svg" class="h-20 w-20" />
        <div>
            <h2 class="block font-medium text-gray-800 dark:text-gray-300">{{ title }}</h2>
            <h3 class="block text-sm text-gray-500">{{ subtitle }}</h3>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: "LoadingComponent",
        props: {
            title: {
                type: String,
                default: "Loading Content...",
            },
            subtitle: {
                type: String,
                default: "Please wait a moment.",
            },
        },
    };
</script>
