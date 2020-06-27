<template>
    <modal ref="baseModal" :showing="isVisible" v-on:cancel="resolve(action.CANCEL)">
        <template v-slot:header>
            <p class="text-2xl text-gray-900">Unsaved Changes</p>
        </template>

        Do you really want to continue and leave this page? You have unsaved changes.

        <template v-slot:footer>
            <button class="mr-10 btn-tertiary" @click="close(action.CANCEL)">Cancel</button>
            <button class="w-24 py-2 px-2 btn btn-blue-primary" @click="close(action.CONFIRM)">Leave</button>
        </template>
    </modal>
</template>

<script lang="ts">
    import Modal from "@/components/modals/Modal.vue";
    import {ref} from "vue";

    export default {
        components: {
            Modal,
        },
        setup() {
            const isVisible = ref(false);
            const baseModal = ref();

            enum action {
                CANCEL,
                CONFIRM
            }

            function show() {
                isVisible.value = true;
                return baseModal.value.show();
            }

            function close(action: action) {
                isVisible.value = false;
                baseModal.value.close(action);
            }

            return {isVisible, show, action, close, baseModal}
        },
    }
</script>
