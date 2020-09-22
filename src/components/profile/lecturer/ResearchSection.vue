<template>
    <section class="border-t-2 py-8 border-gray-400" @keydown.esc="cancelEdit">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Research Area</label>
                    <button v-show="!isEditing" id="editResearchArea" class="ml-4 text-sm btn-blue-tertiary" @click="edit">Edit</button>
                    <button v-show="isEditing" id="saveResearchArea" class="ml-4 text-sm btn-blue-tertiary" @click="save">Save</button>
                    <button v-show="isEditing" id="cancelEditResearchArea" class="ml-4 text-sm btn-blue-tertiary" @click="cancelEdit">
                        Cancel
                    </button>
                </div>
                <label class="block text-gray-600"> This section can be publicly seen. </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Research Area</label>
                    <textarea
                        id="researchArea"
                        v-model="editedUser.researchArea"
                        :readonly="!isEditing"
                        rows="3"
                        class="w-full input-text form-textarea"
                        :class="{ error: errorBag.hasNested('description') }"
                    />
                    <p v-if="errorBag.hasNested('description')" class="error-message">
                        {{ errorBag.getNested("description") }}
                    </p>
                </div>

                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Description</label>
                    <textarea
                        id="description"
                        v-model="editedUser.freeText"
                        :readonly="!isEditing"
                        rows="3"
                        class="w-full input-text form-textarea"
                        :class="{ error: errorBag.hasNested('freeText') }"
                    />
                    <p v-if="errorBag.hasNested('freeText')" class="error-message">
                        {{ errorBag.getNested("freeText") }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { ref, watch } from "vue";
    import UserManagement from "@/api/UserManagement";
    import ValidationResponseHandler from "@/use/helpers/ValidationResponseHandler";
    import { cloneDeep } from "lodash";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import Lecturer from "@/api/api_models/user_management/Lecturer";

    export default {
        props: {
            user: {
                required: true,
                type: Object as () => Lecturer,
            },
        },
        emits: ["update:user"],
        setup(props: any, { emit }: any) {
            const editedUser = ref(cloneDeep(props.user));
            const isEditing = ref(false);
            const errorBag = ref(new ErrorBag());

            //react on saved changes from other components
            watch(
                () => props.user,
                () => {
                    let localResearchChanges = {
                        researchArea: editedUser.value.researchArea,
                        freeText: editedUser.value.freeText,
                    };
                    //update user object
                    editedUser.value = cloneDeep(props.user);
                    // restore local changes
                    editedUser.value.researchArea = localResearchChanges.researchArea;
                    editedUser.value.freeText = localResearchChanges.freeText;
                }
            );

            function edit() {
                isEditing.value = true;
            }

            function cancelEdit() {
                resetInputs();
                isEditing.value = false;
            }

            function resetInputs() {
                editedUser.value = cloneDeep(props.user);
                errorBag.value = new ErrorBag();
            }

            async function save() {
                const auth: UserManagement = new UserManagement();
                const response = await auth.updateUser(editedUser.value);
                const handler = new ValidationResponseHandler();
                if (handler.handleResponse(response)) {
                    isEditing.value = false;
                    emit("update:user", editedUser.value);
                    errorBag.value = new ErrorBag();
                } else {
                    errorBag.value = new ErrorBag(handler.errorList);
                }
            }

            return { isEditing, edit, cancelEdit, save, editedUser, errorBag };
        },
    };
</script>
