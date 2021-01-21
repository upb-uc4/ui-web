<template>
    <div class="space-y-1.5">
        <div class="flex items-center space-x-6">
            <div class="bg-blue-700 dark:bg-lime-500 rounded-full h-8 w-8" />
            <div class="text-base input-label">{{ semester }}</div>
        </div>
        <div class="ml-14 space-y-0.5">
            <div v-for="fieldOfStudy in fieldsOfStudy" :key="fieldOfStudy" class="text-sm text-gray-500">
                {{ fieldOfStudy }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: "ImmatriculationHistoryEntry",
        props: {
            semester: {
                type: String,
                required: true,
            },
            fieldsOfStudy: {
                type: Array,
                required: true,
            },
        },
        setup() {},
    };
</script>
