<template>
    <modal :showing="showing" v-on:cancel="resolve(actions.CANCEL)">
        <template v-slot:header>
            <p class="text-2xl text-gray-900">Unsaved Changes</p>
        </template>

        Do you really want to continue and leave this page? You have unsaved changes.

        <template v-slot:footer>
            <button class="mr-10 btn-tertiary" @click="resolve(actions.CANCEL)">Cancel</button>
            <button class="w-24 py-2 px-2 btn btn-blue-primary" @click="resolve(actions.CONFIRM)">Leave</button>
        </template>
    </modal>
</template>

<script lang="ts">
    import Modal from "@/components/modals/Modal.vue";

    export default {
        components: {
            Modal,
        },
        props: {
            showing: {
                required: true,
                type: Boolean,
            }
        },
        setup() {
            enum actions {
                CANCEL,
                CONFIRM
            }

            let promiseResolve: (x : actions) => void = () => {return};

            function show() {
                return new Promise<actions>(function(resolve) {
                    promiseResolve = resolve;
                });
            }

            function resolve(action: actions) {
                promiseResolve(action);
            }

            return {resolve, show, actions}
        },
    }
</script>
