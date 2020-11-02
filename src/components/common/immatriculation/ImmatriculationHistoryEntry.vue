<template>
    <div
        class="w-full px-4 py-4 whitespace-no-wrap border-gray-300 border-2 bg-gray-100"
        :class="{ 'rounded-t-lg': isFirstRow, 'rounded-b-lg': isLastRow, 'border-b': !isLastRow }"
    >
        <div class="flex items-start justify-between">
            <div class="w-1/2 text font-medium text-gray-600 mb-1 truncate">
                {{ semester }}
            </div>
            <div class="flex-col w-1/2">
                <div v-for="fieldOfStudy in fieldsOfStudy" :key="fieldOfStudy" class="text-gray-600">{{ fieldOfStudy }}</div>
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
            isLastRow: {
                type: Boolean,
            },
            isFirstRow: {
                type: Boolean,
            },
        },
        setup() {},
    };
</script>
