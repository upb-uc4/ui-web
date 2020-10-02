<template>
    <base-menu>
        <template #hook>
            <div class="flex items-center">
                <div v-if="!busy" class="mr-2 text-gray-100 font-semibold tracking-wide">
                    {{ user.firstName }}
                </div>
                <div
                    class="rounded-full w-10 h-10 bg-no-repeat bg-cover bg-center"
                    :style="{ backgroundImage: `url('${profilePicture}')` }"
                ></div>
            </div>
        </template>
        <template #content>
            <aside class="absolute bg-transparent md:w-56 right-0 h-8" />
            <div class="absolute top-auto right-0 bg-white z-30 lg:z-10 shadow-md rounded-lg overflow-hidden border lg:w-56">
                <menu-body />
            </div>
        </template>
    </base-menu>
</template>

<script lang="ts">
    import BaseMenu from "../BaseMenu.vue";
    import MenuBody from "./ProfileMenuBody.vue";
    import { useStore } from "@/use/store/store";
    import { onBeforeMount, ref } from "vue";
    import User from "@/api/api_models/user_management/User";
    import { MutationTypes } from "@/use/store/mutation-types";

    export default {
        components: {
            BaseMenu,
            MenuBody,
        },

        setup() {
            const store = useStore();

            let user = ref({} as User);
            let busy = ref(true);
            let profilePicture = ref("");
            let pictureBaseUrl: string;

            onBeforeMount(async () => {
                user.value = await store.getters.user;
                loadProfilePicture();
                busy.value = false;
            });

            function loadProfilePicture() {
                pictureBaseUrl = process.env.VUE_APP_API_BASE_URL + "/user-management/users/" + user.value.username + "/image?";
                profilePicture.value = pictureBaseUrl;
            }

            store.subscribe((mutation) => {
                if (mutation.type === MutationTypes.UPDATE_PROFILE_PICTURE) {
                    profilePicture.value += pictureBaseUrl + new Date().getTime();
                }
            });

            return { user, busy, profilePicture };
        },
    };
</script>
