<template>
    <div class="relative cursor-pointer" @mouseleave="hide" @mouseover="show">
        <div>Courses</div>

        <transition name="mega-menu-fade">
            <div
                v-show="isVisible"
                class="absolute normal-case font-normal bg-white shadow-md rounded-lg overflow-hidden border mt-4 z-30 lg:z-10 left-0 lg:-left-16"
                style="width: 700px;"
            >
                <menu-body />
                <menu-footer />
            </div>
        </transition>
    </div>
</template>

<script>
    import MenuBody from "./CourseMenuBody";
    import MenuFooter from "./CourseMenuFooter";
    import { ref } from "vue";

    export default {
        components: {
            MenuBody,
            MenuFooter,
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

<style scoped>
    .mega-menu-fade-enter-active,
    .mega-menu-fade-leave-active {
        transition: all 0.1s ease-in-out;
    }

    .mega-menu-fade-enter,
    .mega-menu-fade-leave-to {
        opacity: 0;
        transform: translateY(-12px);
    }
</style>
