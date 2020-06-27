<template>
    <modal :showing="isVisible" v-on:cancel="resolve(actions.CANCEL)">
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
    import {ref} from "vue";

    export default {
        components: {
            Modal,
        },
        setup() {
            const isVisible = ref(false);

            enum actions {
                CANCEL,
                CONFIRM
            }

            let promiseResolve: (x : actions) => void = () => {return};

            function show() {
                isVisible.value = true;
                return new Promise<actions>(function(resolve) {
                    promiseResolve = resolve;
                });
            }

            function resolve(action: actions) {
                isVisible.value = false;
                promiseResolve(action);
            }

            return {resolve, show, actions, isVisible}
        },
    }
</script>
