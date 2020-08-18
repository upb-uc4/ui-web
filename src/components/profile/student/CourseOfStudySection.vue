<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Course of Study</label>
                </div>
                <label class="block text-gray-600">
                    Information related to your individual academic career.
                </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-6 flex flex-col">
                    <div class="flex flex-row">
                        <div class="flex flex-col pl-2">
                            <label class="w-1/2 mb-3 text-sm font-medium text-gray-700">Matriculation-ID</label>
                            <input
                                id="matriculationId"
                                :value="matriculationId"
                                disabled
                                type="text"
                                class="w-full form-input input-text"
                                placeholder="Matriculation-ID"
                            />
                        </div>
                        <div v-if="latest != ''" class="ml-4 flex flex-col">
                            <label class="mb-3 text-sm font-medium text-gray-700 flex">
                                Latest Immatriculation (
                                <button class="cursor-pointer text-sm font-medium navigation-link" @click="showHistory">
                                    view history
                                </button>
                                )
                            </label>
                            <input disabled class="form-input input-text" :value="latest" />
                        </div>
                    </div>
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
                        case action.CANCEL: {
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
