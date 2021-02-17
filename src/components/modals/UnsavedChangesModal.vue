<template>
    <modal ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="modal-headline">Unsaved Changes</p>
        </template>
        <div class="modal-description w-full">Do you really want to continue and leave this page? You have unsaved changes.</div>
        <template #footer>
            <button id="unsavedChangesModalCancel" class="mr-10 btn-tertiary-modal" @click="close(action.CANCEL)">Cancel</button>
            <button id="unsavedChangesModalConfirmLeave" class="w-24 py-2 px-2 btn" @click="close(action.CONFIRM)">Leave</button>
        </template>
    </modal>
</template>

<script lang="ts">
    import Modal from "@/components/modals/Modal.vue";
    import { ref } from "vue";

    export default {
        components: {
            Modal,
        },
        setup() {
            const baseModal = ref();

            enum action {
                CANCEL,
                CONFIRM,
            }

            async function show() {
                return await baseModal.value.show();
            }

            function close(action: action) {
                baseModal.value.close(action);
            }

            return { baseModal, show, close, action };
        },
    };
</script>
