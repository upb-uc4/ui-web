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
            <div class="absolute top-auto right-0 bg-white z-30 lg:z-10 shadow-md rounded-lg overflow-hidden border lg:w-48">
                <menu-body />
            </div>
        </template>
    </base-menu>
</template>

<script lang="ts">
    import BaseMenu from "@/components/navigation/navbar/common/BaseMenu.vue";
    import MenuBody from "@/components/navigation/navbar/common/profile/ProfileMenuBody.vue";
    import { useStore } from "../../../../../store/store";
    import { ref } from "vue";
    import User from "../../../../../api/api_models/user_management/User";
    import Lecturer from "../../../../../api/api_models/user_management/Lecturer";
    import Admin from "../../../../../api/api_models/user_management/Admin";
    import Student from "../../../../../api/api_models/user_management/Student";
    import { MutationTypes } from "../../../../../store/mutation-types";

    export default {
        components: {
            BaseMenu,
            MenuBody,
        },

        setup() {
            const store = useStore();
            let user = store.getters.user;
            console.log(user);
            return { user };
        },
    };
</script>
