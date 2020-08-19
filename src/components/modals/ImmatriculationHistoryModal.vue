<template>
    <modal ref="baseModal" :action="action" @cancel="close(action.CLOSE)">
        <template #header>
            <h1 class="text-2xl text-gray-900">Immatriculation History</h1>
        </template>
        <div v-if="busy" class="w-full items-center justify-center">
            <loading-spinner />
        </div>
        <immatriculation-history :key="historyRefreshKey" v-model:busy="busy" :username="username" />
        <template #footer>
            <div class="flex justify-between">
                <button id="immatriculationHistoryRefresh" title="Refresh" class="btn-tertiary mr-10" @click="refresh">Refresh</button>
                <button id="immatriculationHistoryClose" class="mr-10 btn-tertiary" @click="close(action.CLOSE)">Close</button>
            </div>
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
            let historyRefreshKey = ref(false);

            async function getOwnUserName() {
                const store = useStore();
                username.value = (await store.getters.loginData).username;
            }

            enum action {
                CLOSE,
            }

            async function show() {
                getOwnUserName();
                return await baseModal.value.show();
            }

            function close(action: action) {
                baseModal.value.close(action);
            }

            function refresh() {
                historyRefreshKey.value = !historyRefreshKey.value;
            }

            return { baseModal, show, close, action, alreadyLoadedOnce, busy, username, refresh, historyRefreshKey };
        },
    };
</script>
