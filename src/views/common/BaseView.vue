<template>
    <!-- use this for most views as it restricts the width (exceptions: e.g. dashboard) -->
    <div class="container mx-auto px-4 mt-10">
        <slot />
    </div>
</template>

<script lang="ts">
    export default {
        name: "BaseView",
    };
</script>
