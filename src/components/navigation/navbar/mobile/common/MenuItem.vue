<template>
    <router-link :to="{ name: targetRouteName }">
        <div class="flex items-center">
            <i class="fas text-lg text-gray-100 w-4" :class="iconClass" />
            <span class="ml-4">
                <span class="block text-sm text-gray-100 flex items-center">{{ title }}</span>
            </span>
        </div>
    </router-link>
</template>

<script lang="ts">
    export default {
        name: "GenericMobileMenuItem",
        props: {
            title: {
                required: true,
                type: String,
            },
            iconClass: {
                required: true,
                type: String,
            },
            targetRouteName: {
                required: true,
                type: String,
            },
        },
    };
</script>
