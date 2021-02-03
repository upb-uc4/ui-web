<template>
    <modal ref="baseModal" :action="action" @cancel="close(action.CLOSE)">
        <template #header>
            <h1 class="modal-headline">Immatriculation History</h1>
        </template>
        <loading-spinner v-if="isLoading" class="w-full items-center justify-center" />
        <div class="w-full">
            <immatriculation-history :key="historyRefreshKey" v-model:busy="isLoading" :username="username" />
        </div>
        <template #footer>
            <div class="flex justify-between">
                <button id="immatriculationHistoryRefresh" title="Refresh" class="btn-tertiary-modal mr-10" @click="refresh">
                    Refresh
                </button>
                <button id="immatriculationHistoryClose" class="mr-10 btn-tertiary-modal" @click="close(action.CLOSE)">Close</button>
            </div>
        </template>
    </modal>
</template>

<script lang="ts">
    import Modal from "@/components/modals/Modal.vue";
    import { ref } from "vue";
    import ImmatriculationHistory from "@/components/common/immatriculation/ImmatriculationHistory.vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import { useStore } from "@/use/store/store";

    export default {
        components: {
            Modal,
            ImmatriculationHistory,
            LoadingSpinner,
        },
        setup() {
            const baseModal = ref();
            let isLoading = ref(false);
            let username = ref("");
            let historyRefreshKey = ref(false);

            async function getOwnUserName() {
                const store = useStore();
                username.value = (await store.getters.user).username;
            }

            enum action {
                CLOSE,
            }

            async function show() {
                getOwnUserName();
                historyRefreshKey.value = !historyRefreshKey.value;
                return await baseModal.value.show();
            }

            function close(action: action) {
                baseModal.value.close(action);
            }

            function refresh() {
                historyRefreshKey.value = !historyRefreshKey.value;
            }

            return { baseModal, show, close, action, isLoading, username, refresh, historyRefreshKey };
        },
    };
</script>
