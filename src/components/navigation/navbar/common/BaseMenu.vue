<template>
    <div class="relative" @mouseleave="hide" @mouseover="show">
        <div class="cursor-default">
            <slot name="hook"></slot>
        </div>

        <div v-show="isVisible">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref } from "vue";

    export default {
        name: "BaseMenu",
        props: {
            title: {
                required: false,
                type: String,
                default: "",
            },
        },
        setup() {
            const isVisible = ref(false);

            function show() {
                isVisible.value = true;
            }

            function hide() {
                isVisible.value = false;
            }

            return { isVisible, show, hide };
        },
    };
</script>
