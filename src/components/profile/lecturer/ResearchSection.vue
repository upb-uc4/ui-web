<template>
    <section class="border-t-2 py-8 border-gray-400" @keydown.esc="cancelEdit">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Research Area</label>
                    <button v-show="!isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="edit">Edit</button>
                    <button v-show="isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="save">Save</button>
                    <button v-show="isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="cancelEdit">Cancel</button>
                </div>
                <label class="block text-gray-600">
                    This section can be publicly seen.
                </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Research Area</label>
                    <input v-model="editedResearchArea" :readonly="!isEditing" type="text" class="w-full input-text form-input" />
                </div>

                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Description</label>
                    <textarea v-model="editedDescription" :readonly="!isEditing" rows="3" class="w-full input-text form-textarea" />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { ref } from "vue";

    export default {
        props: ["description", "researchArea"],
        emits: ["save", "update:researchArea", "update:freeText"],
        setup(props: any, { emit }: any) {
            const editedDescription = ref(props.description);
            const editedResearchArea = ref(props.researchArea);
            const isEditing = ref(false);

            function edit() {
                isEditing.value = true;
            }

            function cancelEdit() {
                resetInputs();
                isEditing.value = false;
            }

            function resetInputs() {
                editedResearchArea.value = props.email;
                editedDescription.value = props.description;
            }

            function save() {
                isEditing.value = false;
                emit("update:freeText", editedDescription.value);
                emit("update:researchArea", editedResearchArea.value);
                emit("save");
            }

            return { isEditing, edit, cancelEdit, save, editedResearchArea, editedDescription };
        },
    };
</script>
