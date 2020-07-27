<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Contact</label>
                    <button v-show="!isEditing" id="editContact" class="ml-4 text-sm btn-blue-tertiary" @click="edit">Edit</button>
                    <button v-show="isEditing" id="saveContact" class="ml-4 text-sm btn-blue-tertiary" @click="save">Save</button>
                    <button v-show="isEditing" id="cancelEditContact" class="ml-4 text-sm btn-blue-tertiary" @click="cancelEdit">
                        Cancel
                    </button>
                </div>
                <label class="block text-gray-600">
                    How can we reach you?
                </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Email</label>
                    <input id="email" v-model="editedEmail" type="email" :readonly="!isEditing" class="w-full input-text form-input" />
                </div>

                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Phone</label>
                    <input id="phoneNumber" placeholder="+123 456 789" readonly type="text" class="w-full input-text form-input" />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { ref } from "vue";

    export default {
        props: {
            email: {
                required: true,
                type: String,
            },
        },
        emits: ["save", "update:email"],
        setup(props: any, { emit }: any) {
            const editedEmail = ref(props.email);
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
                emit("update:email", editedEmail.value);
                emit("save");
            }

            return { isEditing, edit, cancelEdit, save, editedEmail };
        },
    };
</script>
