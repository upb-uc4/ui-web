<template>
    <modal :showing="isVisible" v-on:cancel="resolve(action.CANCEL)">
        <template v-slot:header>
            <p class="text-2xl text-gray-900">Delete course</p>
        </template>

        Are you sure you want to delete this course?<br/>
        By doing this you will lose all of your saved data and will not be able to restore it.

        <template v-slot:footer>
            <button class="mr-10 btn-tertiary" @click="resolve(action.CANCEL)">Cancel</button>
            <button class="w-24 py-2 px-2 btn btn-red-primary" @click="resolve(action.DELETE)">Delete</button>
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

            function resolve(action: action) {
                isVisible.value = false;
                promiseResolve(action);
            }

            return {resolve, show, action, isVisible}
        },
    }
</script>
