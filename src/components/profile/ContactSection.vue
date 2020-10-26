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
                <label class="block text-gray-600"> How can we reach you? </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Email</label>
                    <input
                        id="email"
                        v-model="editedUser.email"
                        type="email"
                        :readonly="!isEditing"
                        class="w-full input-text form-input"
                        :class="{ error: errorBag.hasNested('email') }"
                    />
                    <p v-if="errorBag.hasNested('email')" class="error-message">
                        {{ errorBag.getNested("email") }}
                    </p>
                </div>

                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Phone</label>
                    <input
                        id="phoneNumber"
                        v-model="editedUser.phoneNumber"
                        placeholder="+123 456 789"
                        :readonly="!isEditing"
                        class="w-full input-text form-input"
                        :class="{ error: errorBag.hasNested('phoneNumber') }"
                    />
                    <p v-if="errorBag.hasNested('phoneNumber')" class="error-message">
                        {{ errorBag.getNested("phoneNumber") }}
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
    import { showUpdateSuccessToast, showUpdateFailedToast } from "@/use/helpers/Toasts";

    export default {
        props: {
            user: {
                required: true,
                type: Object,
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
                    let localContactChanges = {
                        email: editedUser.value.email,
                        phoneNumber: editedUser.value.phoneNumber,
                    };
                    //update user object
                    editedUser.value = cloneDeep(props.user);
                    // restore local changes
                    editedUser.value.email = localContactChanges.email;
                    editedUser.value.phoneNumber = localContactChanges.phoneNumber;
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
                const handler = new ValidationResponseHandler("contact data");
                if (handler.handleResponse(response)) {
                    isEditing.value = false;
                    emit("update:user", editedUser.value);
                    errorBag.value = new ErrorBag();
                    showUpdateSuccessToast("Contact information");
                } else {
                    errorBag.value = new ErrorBag(handler.errorList);
                }
            }

            return { isEditing, edit, cancelEdit, save, editedUser, errorBag };
        },
    };
</script>
