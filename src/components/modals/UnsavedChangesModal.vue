<template>
    <modal ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="text-2xl text-gray-900">Unsaved Changes</p>
        </template>

        Do you really want to continue and leave this page? You have unsaved changes.

        <template #footer>
            <button id="modalCancel" class="mr-10 btn-tertiary" @click="close(action.CANCEL)">Cancel</button>
            <button id="modalConfirmLeave" class="w-24 py-2 px-2 btn btn-blue-primary" @click="close(action.CONFIRM)">Leave</button>
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
