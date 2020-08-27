<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Address</label>
                    <button v-show="!isEditing" id="editAddress" class="ml-4 text-sm btn-blue-tertiary" @click="edit">Edit</button>
                    <button v-show="isEditing" id="saveAddress" class="ml-4 text-sm btn-blue-tertiary" @click="save">Save</button>
                    <button v-show="isEditing" id="cancelEditAddress" class="ml-4 text-sm btn-blue-tertiary" @click="cancelEdit">
                        Cancel
                    </button>
                </div>
                <label class="block text-gray-600">
                    Please keep your address information as up to date as possible.
                </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Country</label>
                    <select
                        id="country"
                        v-model="editedUser.address.country"
                        :disabled="!isEditing"
                        class="w-full form-select input-select"
                    >
                        <option v-for="country in countries" :key="country" :selected="country === editedUser.address.country">{{
                            country
                        }}</option>
                    </select>
                </div>

                <div class="lg:flex mb-6 justify-between">
                    <div class="lg:mb-0 flex flex-col w-5/6 mr-3">
                        <label class="text-gray-700 text-md font-medium mb-3">City</label>
                        <input
                            id="city"
                            v-model="editedUser.address.city"
                            type="text"
                            :readonly="!isEditing"
                            class="w-full input-text form-input"
                            :class="{ error: errorBag.hasNested('city') }"
                        />
                        <p v-if="errorBag.hasNested('city')" class="error-message">
                            {{ errorBag.getNested("city") }}
                        </p>
                    </div>
                    <div class="lg:mb-0 flex flex-col w-1/6">
                        <label class="text-gray-700 text-md font-medium mb-3">Postal Code</label>
                        <input
                            id="zipCode"
                            v-model="editedUser.address.zipCode"
                            type="text"
                            :readonly="!isEditing"
                            class="w-full input-text form-input"
                            :class="{ error: errorBag.hasNested('zipCode') }"
                        />
                        <p v-if="errorBag.hasNested('zipCode')" class="error-message">
                            {{ errorBag.getNested("zipCode") }}
                        </p>
                    </div>
                </div>
                <div class="lg:flex flex-row justify-between mb-6">
                    <div class="flex flex-col w-5/6 mr-3">
                        <label class="text-gray-700 text-md font-medium mb-3">Street</label>
                        <input
                            id="street"
                            v-model="editedUser.address.street"
                            type="text"
                            :readonly="!isEditing"
                            class="input-text form-input"
                            :class="{ error: errorBag.hasNested('street') }"
                        />
                        <p v-if="errorBag.hasNested('street')" class="error-message">
                            {{ errorBag.getNested("street") }}
                        </p>
                    </div>
                    <div class="flex flex-col w-1/6">
                        <label class="text-gray-700 text-md font-medium mb-3">Nr.</label>
                        <input
                            id="houseNumber"
                            v-model="editedUser.address.houseNumber"
                            type="text"
                            :readonly="!isEditing"
                            class="input-text form-input"
                            :class="{ error: errorBag.hasNested('houseNumber') }"
                        />
                        <p v-if="errorBag.hasNested('houseNumber')" class="error-message">
                            {{ errorBag.getNested("houseNumber") }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { ref, watch } from "vue";
    import { Country } from "@/entities/Country";
    import UserManagement from "@/api/UserManagement";
    import ValidationResponseHandler from "@/use/ValidationResponseHandler";
    import { cloneDeep } from "lodash";
    import ErrorBag from "@/use/ErrorBag";
    import Admin from "@/api/api_models/user_management/Admin";

    export default {
        props: {
            user: {
                required: true,
                type: Object,
            },
        },
        emits: ["update:user"],
        setup(props: any, { emit }: any) {
            const countries = Object.values(Country).filter((e) => e != Country.NONE);
            const editedUser = ref(cloneDeep(props.user));
            const isEditing = ref(false);
            const errorBag = ref(new ErrorBag());

            //react on saved changes from other components
            watch(
                () => props.user,
                () => {
                    let localAddressChanges = editedUser.value.address;
                    //update user object
                    editedUser.value = cloneDeep(props.user);
                    // restore local changes
                    editedUser.value.address = localAddressChanges;
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
                if (handler.handleReponse(response)) {
                    isEditing.value = false;
                    emit("update:user", editedUser.value);
                    errorBag.value = new ErrorBag();
                } else {
                    errorBag.value = new ErrorBag(handler.errorList);
                }
            }

            return { isEditing, edit, cancelEdit, save, countries, editedUser, errorBag };
        },
    };
</script>
