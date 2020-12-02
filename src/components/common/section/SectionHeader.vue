<template>
    <button class="flex items-center mb-4 navigation-link">
        <i class="text-xl fas fa-chevron-left" />
        <span class="ml-1 text-sm font-bold">{{ backButtonText }}</span>
    </button>
    <h1 class="mb-8 text-2xl font-medium text-gray-600">{{ title }}</h1>
</template>

<script>
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
        },
        //todo navigation target prop
        //todo option to make it sticky
    };
</script>
