<template>
    <modal :showing="showing" v-on:cancel="$emit('cancel')">
        <template v-slot:header>
            <p class="text-2xl text-gray-900">Unsaved Changes</p>
        </template>

        Do you really want to continue and leave this site? You have unsaved changes.

        <template v-slot:footer>
            <button class="w-24 py-2 px-2 btn btn-blue-primary" @click="$emit('confirm')">Continue</button>
        </template>
    </modal>
</template>

<script lang="ts">
    import Modal from "@/components/modals/Modal.vue";

    export default {
        components: {
            Modal,
        },
        emits: ['cancel', 'confirm'],
        props: {
            showing: {
                required: true,
                type: Boolean,
            }
        }
    }
</script>
