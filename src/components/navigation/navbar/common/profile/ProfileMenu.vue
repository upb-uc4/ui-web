<template>
    <div class="relative cursor-pointer" @mouseleave="hide" @mouseover="show">
        <div class="flex items-center">
            <div class="mr-2 text-gray-100 font-semibold tracking-wide">
                Theo
            </div>
            <img class="rounded-full w-10 h-10 ml-2" src="@/assets/blank_profile_picture.png" alt="profile_image" />
        </div>
        <transition name="menu-fade">
            <div
                v-show="isVisible"
                class="absolute normal-case font-normal bg-white shadow-md rounded-lg overflow-hidden border z-30 lg:z-10 right-0 lg:w-64"
            >
                <menu-body />
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
    import { ref } from "vue";
    import MenuBody from "@/components/navigation/navbar/common/profile/ProfileMenuBody.vue";

    export default {
        name: "ProfileMenu",
        components: {
            MenuBody,
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
