<template>
    <base-menu>
        <template #hook>
            <div class="flex items-center">
                <div class="mr-2 text-gray-100 font-semibold tracking-wide">
                    {{ user.firstName }}
                </div>
                <img class="rounded-full w-10 h-10 ml-2" src="@/assets/blank_profile_picture.png" alt="profile_image" />
            </div>
        </template>
        <template #content>
            <aside class="absolute bg-transparent md:w-48 right-0 h-8" />
            <div class="absolute top-auto right-0 bg-white z-30 lg:z-10 shadow-md rounded-lg overflow-hidden border lg:w-48">
                <menu-body />
            </div>
        </template>
    </base-menu>
</template>

<script lang="ts">
    import BaseMenu from "../BaseMenu.vue";
    import MenuBody from "./ProfileMenuBody.vue";
    import { useStore } from "@/store/store";

    export default {
        components: {
            BaseMenu,
            MenuBody,
        },

        setup() {
            const store = useStore();
            let user = store.getters.user;
            return { user };
        },
    };
</script>
