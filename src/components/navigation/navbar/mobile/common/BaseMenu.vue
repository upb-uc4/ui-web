<template>
    <div>
        <div class="cursor-pointer">
            <slot name="hook"></slot>
        </div>
        <slot name="content"></slot>
    </div>
</template>

<script lang="ts">
    export default {
        name: "MobileBaseMenu",
        setup() {
            //todo: make the hook collapse its content
        },
    };
</script>
