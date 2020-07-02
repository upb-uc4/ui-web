<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Contact</label>
                    <button v-show="!isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="edit">Edit</button>
                    <button v-show="isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="save">Save</button>
                    <button v-show="isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="cancelEdit">Cancel</button>
                </div>
                <label class="block text-gray-600">
                    How can we reach you?
                </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Email</label>
                    <input type="email" :readonly="!isEditing" :value="editedEmail" @input="onEmailChanged($event.target.value)"
                           :class="{'bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400' : !isEditing}"
                           class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                </div>

                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Phone</label>
                    <input placeholder="+123 456 789" readonly type="text"
                           class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input placeholder-gray-600 bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400">
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import {ref, watch} from "vue";

    export default {
        props: ["email"],
        emits: ["save", "update:email"],
        setup(props: any, {emit}: any) {
            const isEditing = ref(false);

            function edit() {
                isEditing.value = true;
            }

            function cancelEdit() {
                resetInputs();
                isEditing.value = false;
            }

            function resetInputs() {
                editedEmail.value = props.email;
            }

            function save() {
                isEditing.value = false;
                updateEmail(editedEmail.value);
                emit("save");
            }

            function updateEmail(email: string) {
                emit('update:email', email);
            }

            const editedEmail = ref(props.email);

            function onEmailChanged(name: string) {
                editedEmail.value = name;
            }

            watch(() => props.email, (newValue) => {
                editedEmail.value = newValue;
            });

            return {isEditing, edit, cancelEdit, save,
                onEmailChanged, editedEmail,};
        },

    }
</script>