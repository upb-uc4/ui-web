<template>
    <modal :showing="showing" v-on:cancel="$emit('cancel')">
        <template v-slot:header>
            <p class="text-2xl text-gray-900">Delete course</p>
        </template>

        <p>
            Are you sure you want to delete this course?
            By doing this you will lose all of your saved data and will not be able to retrieve it.
        </p>

        <template v-slot:footer>
            <button class="w-24 py-2 px-2 btn btn-red-primary" @click="$emit('delete')">Delete</button>
        </template>
    </modal>
</template>

<script lang="ts">
    import Modal from "@/components/modals/Modal.vue";

    export default {
        components: {
            Modal,
        },
        emits: ['cancel', 'delete'],
        props: {
            showing: {
                required: true,
                type: Boolean,
            }
        }
    }
</script>
