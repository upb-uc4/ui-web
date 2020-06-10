<template>
    <div>
        {{ course.name }}
    </div>
</template>

<script lang="ts">
    export default {
        name: "Test",
        props: ['course'],
    };
</script>