<template>
    <router-link :to="{ name: targetRouteName }">
        <div class="hover:bg-gray-200 rounded-lg p-2">
            <div class="flex items-center">
                <i class="fas text-lg text-blue-500 group-hover:text-blue-800 w-4" :class="iconClass" />
                <span class="ml-4">
                    <span class="block font-bold text-blue-800 group-hover:text-blue-800 flex items-center">{{ title }}</span>
                </span>
                <div v-if="isHorizontallyAligned" class="ml-4">
                    <span class="block text-sm text-gray-600 group-hover:text-blue-800">{{ description }}</span>
                </div>
            </div>
            <div v-if="!isHorizontallyAligned" class="ml-8">
                <span class="block text-sm text-gray-600 group-hover:text-blue-800">{{ description }}</span>
            </div>
        </div>
    </router-link>
</template>

<script lang="ts">
    export default {
        name: "GenericMenuItem",
        props: {
            title: {
                required: true,
                type: String,
            },
            description: {
                required: false,
                type: String,
                default: "",
            },
            iconClass: {
                required: true,
                type: String,
            },
            isHorizontallyAligned: {
                required: false,
                type: Boolean,
                default: false,
            },
            targetRouteName: {
                required: true,
                type: String,
            },
        },
    };
</script>
