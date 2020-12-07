<template>
    <modal ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="text-gray-800 text-lg font-medium mb-2">Delete Profile Picture</p>
        </template>
        <div class="text-gray-500 text-sm">Are you sure you want to delete the profile picture? You won't be able to restore it.</div>
        <template #footer>
            <button
                id="deleteProfilePictureModalCancel"
                class="mr-10 text-gray-600 hover:text-gray-700 btn-tertiary-tmp"
                @click="close(action.CANCEL)"
            >
                Cancel
            </button>
            <button id="deleteProfilePictureModalDelete" class="w-24 py-2 px-2 btn btn-remove-tmp" @click="close(action.DELETE)">
                Delete
            </button>
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
