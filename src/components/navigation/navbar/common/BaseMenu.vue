<template>
    <div class="relative cursor-pointer" @mouseleave="hide" @mouseover="show">
        <slot name="hook"></slot>
        <transition v-show="isVisible" name="menu-fade">
            <slot name="content"></slot>
        </transition>
    </div>
</template>

<script>
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
