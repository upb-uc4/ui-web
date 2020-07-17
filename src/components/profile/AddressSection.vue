<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Address</label>
                    <button v-show="!isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="edit">Edit</button>
                    <button v-show="isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="save">Save</button>
                    <button v-show="isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="cancelEdit">Cancel</button>
                </div>
                <label class="block text-gray-600">
                    Please keep your address information as up to date as possible.
                </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Country</label>
                    <select v-model="editedAddress.country" :disabled="!isEditing" class="w-full form-select input-select">
                        <option v-for="country in countries" :key="country" :selected="country === editedAddress.country">{{
                            country
                        }}</option>
                    </select>
                </div>

                <div class="lg:flex mb-6">
                    <div class="lg:w-2/3 mb-6 lg:mb-0 flex flex-col lg:mr-16">
                        <label class="text-gray-700 text-md font-medium mb-3">City</label>
                        <input v-model="editedAddress.city" type="text" :readonly="!isEditing" class="w-full input-text form-input" />
                    </div>
                    <div class="lg:w-1/3 mb-6 lg:mb-0 flex flex-col">
                        <label class="text-gray-700 text-md font-medium mb-3">Postal Code</label>
                        <input v-model="editedAddress.zipCode" type="text" :readonly="!isEditing" class="w-full input-text form-input" />
                    </div>
                </div>

                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Street</label>
                    <input v-model="editedAddress.street" type="text" :readonly="!isEditing" class="w-full input-text form-input" />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { ref } from "vue";
    import { Country } from "@/entities/Country";

    export default {
        props: {
            address: {
                type: Object,
            },
        },
        emits: ["save", "update:address"],
        setup(props: any, { emit }: any) {
            const countries = Object.values(Country).filter((e) => e != Country.NONE);
            const editedAddress = ref(props.address);
            const isEditing = ref(false);

            function edit() {
                isEditing.value = true;
            }

            function cancelEdit() {
                resetInputs();
                isEditing.value = false;
            }

            function resetInputs() {
                editedAddress.value = props.address;
            }

            function save() {
                isEditing.value = false;
                emit("update:address", editedAddress.value);
                emit("save");
            }

            return { isEditing, edit, cancelEdit, save, countries, editedAddress };
        },
    };
</script>
