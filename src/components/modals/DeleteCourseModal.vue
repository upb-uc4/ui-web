<template>
    <modal :showing="isVisible" v-on:cancel="close(action.CANCEL)">
        <template v-slot:header>
            <p class="text-2xl text-gray-900">Delete course</p>
        </template>

        Are you sure you want to delete this course?<br/>
        By doing this you will lose all of your saved data and will not be able to restore it.

        <template v-slot:footer>
            <button class="mr-10 btn-tertiary" @click="close(action.CANCEL)">Cancel</button>
            <button class="w-24 py-2 px-2 btn btn-red-primary" @click="close(action.DELETE)">Delete</button>
        </template>
    </modal>
</template>

<script lang="ts">
    import Modal from "@/components/modals/Modal.vue";
    import { ref } from 'vue';

    export default {
        components: {
            Modal,
        },
        setup() {
            const isVisible = ref(false);

            enum action {
                CANCEL,
                DELETE
            }

            let promiseResolve: (x : action) => void = () => {return};

            function show() {
                isVisible.value = true;
                return new Promise<action>(function(resolve) {
                    promiseResolve = resolve;
                });
            }

            function close(action: action) {
                isVisible.value = false;
                promiseResolve(action);
            }

            return {isVisible, show, action, close}
        },
    }
</script>
