<template>
    <div class="w-full rounded-md p-4 whitespace-no-wrap input-text">
        <div class="flex items-start justify-between">
            <div class="font-medium truncate">{{ semester }}</div>
            <div>
                <div v-for="fieldOfStudy in fieldsOfStudy" :key="fieldOfStudy">{{ fieldOfStudy }}</div>
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
