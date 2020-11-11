<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Course of Study</label>
                </div>
                <label class="block text-gray-600"> Information related to your individual academic career. </label>
            </div>
            <div class="mb-6 flex flex-col w-full lg:w-2/3">
                <div class="flex flex-col lg:w-1/2 w-full">
                    <label class="mb-3 text-sm font-medium text-gray-700">Matriculation-ID</label>
                    <input
                        id="matriculationId"
                        :value="matriculationId"
                        readonly
                        type="text"
                        class="w-full form-input input-text"
                        placeholder="Matriculation-ID"
                    />
                    <p v-if="latest == ''" class="mb-3 mt-1 text-xs font-medium text-gray-600">There is no matriculation, yet!</p>
                </div>
                <div v-if="latest != ''" class="flex flex-col w-1/2 mt-3">
                    <label class="mb-3 text-sm font-medium text-gray-700 flex">
                        Latest Immatriculation (
                        <button id="showHistoryButton" class="cursor-pointer text-sm font-medium navigation-link" @click="showHistory">
                            View History
                        </button>
                        )
                    </label>
                    <input id="latestImmatriculation" disabled class="form-input input-text" :value="latest" />
                </div>
            </div>
        </div>
    </section>
    <immatriculation-history-modal ref="historyModal" />
</template>

<script lang="ts">
    import { ref } from "vue";
    import ImmatriculationHistoryModal from "@/components/modals/ImmatriculationHistoryModal.vue";

    export default {
        components: {
            ImmatriculationHistoryModal,
        },
        props: {
            matriculationId: {
                type: String,
                required: true,
            },
            latest: {
                type: String,
                required: true,
            },
        },
        setup() {
            let historyModal = ref();

            async function showHistory() {
                let modal = historyModal.value;
                let action = modal.action;
                modal.show().then((response: typeof action) => {
                    switch (response) {
                        case action.CLOSE: {
                            //do nothing
                            break;
                        }
                    }
                });
            }

            return {
                showHistory,
                historyModal,
            };
        },
    };
</script>
