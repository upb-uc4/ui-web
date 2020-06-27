<template>
    <modal :showing="isVisible" v-on:cancel="resolve(action.CANCEL)">
        <template v-slot:header>
            <p class="text-2xl text-gray-900">Unsaved Changes</p>
        </template>

        Do you really want to continue and leave this page? You have unsaved changes.

        <template v-slot:footer>
            <button class="mr-10 btn-tertiary" @click="resolve(action.CANCEL)">Cancel</button>
            <button class="w-24 py-2 px-2 btn btn-blue-primary" @click="resolve(action.CONFIRM)">Leave</button>
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

            enum action {
                CANCEL,
                CONFIRM
            }

            let promiseResolve: (x : action) => void = () => {return};

            function show() {
                isVisible.value = true;
                return new Promise<action>(function(resolve) {
                    promiseResolve = resolve;
                });
            }

            function resolve(action: action) {
                isVisible.value = false;
                promiseResolve(action);
            }

            return {isVisible, show, action, resolve}
        },
    }
</script>
