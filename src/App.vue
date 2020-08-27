<template>
    <div id="root" class="">
        <navbar />
        <div class="container mx-auto px-4">
            <router-view />
            <div id="modal-wrapper" />
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

            onMounted(() => {
                useStore().commit(MutationTypes.SET_MODAL, loginModal.value.show);
            });
            return {
                loginModal,
            };
        },
    };
</script>
