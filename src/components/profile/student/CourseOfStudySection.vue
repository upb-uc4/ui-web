<template>
    <BaseSection title="Course of Study" subtitle="Information related to your individual academic career.">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Matriculation-ID</label>
                    <input id="matriculationId" :value="matriculationId" type="text" readonly class="w-full input-text" />
                    <label v-if="!latest" class="input-label-warning">You have not yet been matriculated!</label>
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div v-if="latest" class="lg:w-1/2 w-full">
                    <label class="input-label">
                        Latest Immatriculation (
                        <button id="showHistoryButton" class="btn-tertiary" @click="showHistory">View History</button>
                        )
                    </label>
                    <input id="latestImmatriculation" readonly class="w-full input-text" :value="latest" />
                </div>
            </div>
        </div>
    </BaseSection>
    <immatriculation-history-modal ref="historyModal" />
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import { ref } from "vue";
    import ImmatriculationHistoryModal from "@/components/modals/ImmatriculationHistoryModal.vue";

    export default {
        name: "CourseOfStudySection",
        components: {
            BaseSection,
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
