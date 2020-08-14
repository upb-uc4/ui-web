<template>
    <modal ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="text-2xl text-gray-900">Immatriculation History</p>
        </template>
        <div v-if="busy" class="w-full items-center justify-center">
            <loading-spinner />
        </div>
        <immatriculation-history v-if="alreadyLoadedOnce" v-model:busy="busy" :username="username" />
        <template #footer>
            <button id="immatriculationHistoryCancel" class="mr-10 btn-tertiary" @click="close(action.CANCEL)">Cancel</button>
        </template>
    </modal>
</template>

<script lang="ts">
    import Modal from "@/components/modals/Modal.vue";
    import { ref, onBeforeMount } from "vue";
    import ImmatriculationHistory from "@/components/ImmatriculationHistory.vue";
    import LoadingSpinner from "@/components/loading/Spinner.vue";
    import { useStore } from "@/store/store";

    export default {
        components: {
            Modal,
            ImmatriculationHistory,
            LoadingSpinner,
        },
        setup() {
            const baseModal = ref();
            let busy = ref(false);
            let alreadyLoadedOnce = ref(false);
            let username = ref("");

            async function getOwnUserName() {
                const store = useStore();
                username.value = (await store.getters.loginData).username;
            }

            enum action {
                CANCEL,
                DELETE,
            }

            async function show() {
                if (!alreadyLoadedOnce.value) {
                    getOwnUserName();
                }
                alreadyLoadedOnce.value = true;
                return await baseModal.value.show();
            }

            function close(action: action) {
                baseModal.value.close(action);
            }

            return { baseModal, show, close, action, alreadyLoadedOnce, busy, username };
        },
    };
</script>
