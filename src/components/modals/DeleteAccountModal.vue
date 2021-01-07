<template>
    <modal ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="modal-headline">Delete account</p>
        </template>
        <div class="modal-description">
            Are you sure you want to delete this account?<br />
            By doing this you will lose all of your saved data and will not be able to restore it.
        </div>

        <template #footer>
            <button id="deleteAccountModalCancel" class="mr-10 btn-tertiary-modal" @click="close(action.CANCEL)">Cancel</button>
            <button id="deleteAccountModalDelete" class="w-24 py-2 px-2 btn-remove-tmp" @click="close(action.DELETE)">Delete</button>
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
                DELETE,
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
