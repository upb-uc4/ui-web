<template>
    <base-menu>
        <template #hook>Exams</template>
        <template #content>
            <div>
                <!-- hack to keep the menu open even when hovering over the gap between hook and content-->
                <aside class="absolute bg-transparent md:w-48 left-0 lg:w-160 h-8" />
                <div class="absolute left-0 lg:w-64 mt-4 z-30 lg:z-10 shadow-md rounded-lg overflow-hidden bg-white dark:bg-normalgray-800">
                    <menu-body />
                </div>
            </div>
        </template>
    </base-menu>
</template>

<script lang="ts">
    import BaseMenu from "../../common/BaseMenu.vue";
    import MenuBody from "./ExamsMenuBody.vue";

    export default {
        components: {
            BaseMenu,
            MenuBody,
        },
    };
</script>
