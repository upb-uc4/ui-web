<template>
    <modal :showing="showing" v-on:cancel="resolve(actions.CANCEL)">
        <template v-slot:header>
            <p class="text-2xl text-gray-900">Delete course</p>
        </template>

        Are you sure you want to delete this course?<br/>
        By doing this you will lose all of your saved data and will not be able to restore it.

        <template v-slot:footer>
            <button class="mr-10 btn-tertiary" @click="resolve(actions.CANCEL)">Cancel</button>
            <button class="w-24 py-2 px-2 btn btn-red-primary" @click="resolve(actions.DELETE)">Delete</button>
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
                DELETE
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
