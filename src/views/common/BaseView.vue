<template>
    <!-- use this for most views as it restricts the width (exceptions: e.g. dashboard) -->
    <div class="container mx-auto">
        <slot />
    </div>
</template>

<script lang="ts">
    export default {
        name: "BaseView",
    };
</script>
