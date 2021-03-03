<template>
    <div class="w-full h-full flex items-center justify-center">
        <label class="text-gray-500 font-medium flex"> No relevant {{ contentType }} found. </label>
    </div>
</template>

<script lang="ts">
    export default {
        name: "DefaultListContent",
        props: {
            contentType: {
                type: String,
                required: false,
                default: "content",
            },
        },
    };
</script>
