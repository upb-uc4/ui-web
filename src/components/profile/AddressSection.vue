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
                    <select :readonly="!isEditing" @input="onCountryChanged($event.target.value)"
                            :class="{'bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400' : !isEditing}"
                            class="w-full form-select block border-2 border-gray-400 rounded-lg text-gray-600 py-3">
                        <option v-for="country in countries" :key="country" :selected="country === editedAddress.country" >{{ country }}</option>
                    </select>

                </div>

                <div class="lg:flex mb-6">
                    <div class="lg:w-2/3 mb-6 lg:mb-0 flex flex-col lg:mr-16">
                        <label class="text-gray-700 text-md font-medium mb-3">City</label>
                        <input type="text" :readonly="!isEditing" :value="editedAddress.city" @input="onCityChanged($event.target.value)"
                               :class="{'bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400' : !isEditing}"
                               class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                    </div>
                    <div class="lg:w-1/3 mb-6 lg:mb-0 flex flex-col">
                        <label class="text-gray-700 text-md font-medium mb-3">Postal Code</label>
                        <input type="text" :readonly="!isEditing" :value="editedAddress.zipCode" @input="onPostalCodeChanged($event.target.value)"
                               :class="{'bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400' : !isEditing}"
                               class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                    </div>
                </div>

                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Street</label>
                    <input type="text" :readonly="!isEditing" :value="editedAddress.street" @input="onStreetChanged($event.target.value)"
                           :class="{'bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400' : !isEditing}"
                           class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import {ref, watch} from "vue";
    import Address from "@/api/api_models/user_management/Address";
    import {Country} from "@/entities/Country";

    export default {
        props: {
            address: {
                type: Object
            }
        },
        emits: ["save", "update:address"],
        setup(props: any, {emit}: any) {
            const countries = Object.values(Country).filter(e => e != Country.NONE);
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
                updateAddress(editedAddress.value);
                emit("save");
            }

            function updateAddress(address: Address) {
                emit('update:address', address);
            }

            const editedAddress = ref(props.address);

            function onStreetChanged(street: string) {
                editedAddress.value.street = street;
            }

            function onHouseNumberChanged(houseNumber: string) {
                editedAddress.value.houseNumber = houseNumber;
            }

            function onPostalCodeChanged(postalCode: string) {
                editedAddress.value.zipCode = postalCode;
            }

            function onCityChanged(city: string) {
                editedAddress.value.city = city;
            }

            function onCountryChanged(country: string) {
                editedAddress.value.country = country;
            }

            watch(() => props.address, (newValue) => {
                editedAddress.value = newValue;
            });

            return {isEditing, edit, cancelEdit, save,
                editedAddress,
                onStreetChanged, onPostalCodeChanged, onCityChanged, onCountryChanged,
                countries};
        },

    }
</script>