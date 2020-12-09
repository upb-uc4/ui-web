<template>
    <div id="root" class="">
        <navbar />
        <div class="container mx-auto px-4 mt-10">
            <router-view />
            <div id="modal-wrapper" />
        </div>
        <login-modal ref="loginModal" />
        <encrypt-private-key-modal ref="encryptionModal" />
        <decrypt-private-key-modal ref="decryptionModal" />
    </div>
</template>

<script lang="ts">
    import LoginModal from "@/components/modals/LoginModal.vue";
    import EncryptPrivateKeyModal from "@/components/modals/EncryptPrivateKeyModal.vue";
    import DecryptPrivateKeyModal from "@/components/modals/DecryptPrivateKeyModal.vue";
    import Navbar from "@/components/navigation/navbar/Navbar.vue";
    import { store, useStore } from "./use/store/store";
    import { ref, onMounted } from "vue";
    import { MutationTypes } from "./use/store/mutation-types";

    export default {
        name: "App",
        components: {
            LoginModal,
            Navbar,
            DecryptPrivateKeyModal,
            EncryptPrivateKeyModal,
        },
        setup() {
            let loginModal = ref();
            let encryptionModal = ref();
            let decryptionModal = ref();
            const store = useStore();

            store.subscribe((mutation, state) => {
                if (mutation.type === MutationTypes.RESET_STATE) {
                    setModals();
                }
            });

            function setModals() {
                store.commit(MutationTypes.SET_MODAL, loginModal.value.show);
                store.commit(MutationTypes.SET_DECRYPT_PRIVATE_KEY_MODAL, decryptionModal.value.show);
                store.commit(MutationTypes.SET_ENCRYPT_PRIVATE_KEY_MODAL, encryptionModal.value.show);
            }

            onMounted(() => {
                setModals();
            });
            return {
                loginModal,
                encryptionModal,
                decryptionModal,
            };
        },
    };
</script>
