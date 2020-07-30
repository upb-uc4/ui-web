<template>
    <div id="root" class="">
        <navbar />
        <div class="container mx-auto px-4">
            <router-view />
            <div id="modal-wrapper" />
            <div class="w-3/4 fixed bottom-0">
                <p class="text-xs text-right text-gray-700 mb-2 mr-2">Frontend Version {{ version }}</p>
            </div>
        </div>
        <login-modal ref="loginModal" />
    </div>
</template>

<script lang="ts">
    import LoginModal from "@/components/modals/LoginModal.vue";
    import Navbar from "@/components/navigation/navbar/Navbar.vue";
    import { store, useStore } from "@/store/store";
    import { ref, onMounted } from "vue";
    import { MutationTypes } from "./store/mutation-types";

    export default {
        name: "App",
        components: {
            LoginModal,
            Navbar,
        },
        setup() {
            let loginModal = ref();
            const version = "v" + process.env.VUE_APP_VERSION;

            onMounted(() => {
                useStore().commit(MutationTypes.SET_MODAL, loginModal.value.show);
            });
            return {
                version,
                loginModal,
            };
        },
    };
</script>
