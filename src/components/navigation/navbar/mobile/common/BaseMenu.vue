<template>
    <div>
        <div class="cursor-pointer" @click="toggleOpen">
            <i class="fas mr-2 w-4" :class="[isOpen ? 'fa-chevron-down' : 'fa-chevron-right']" />
            <slot name="hook"></slot>
        </div>
        <div v-show="isOpen">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref } from "vue";

    export default {
        name: "MobileBaseMenu",
        setup() {
            const isOpen = ref(true);
            function toggleOpen() {
                isOpen.value = !isOpen.value;
            }
            return { isOpen, toggleOpen };
        },
    };
</script>
