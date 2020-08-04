<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Personal Information</label>
                <label class="block text-gray-600">
                    Personal Information and Contact Data for the User
                </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="flex flex-col mb-4">
                    <label class="mb-3 font-medium text-gray-700 text-md">
                        Name
                    </label>
                    <div class="flex flex-row">
                        <div class="flex-col w-full pr-2">
                            <label class="text-sm text-gray-700">Firstname</label>
                            <input
                                id="firstName"
                                v-model="accountFirstName"
                                type="text"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.hasNested('firstName') }"
                                placeholder="Firstname"
                            />
                            <p v-if="errorBag.hasNested('firstName')" class="error-message">
                                {{ errorBag.getNested("firstName") }}
                            </p>
                        </div>
                        <div class="flex-col w-full pl-2">
                            <label class="text-sm text-gray-700">Lastname</label>
                            <input
                                id="lastName"
                                v-model="accountLastName"
                                type="text"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.hasNested('lastName') }"
                                placeholder="Lastname"
                            />
                            <p v-if="errorBag.hasNested('lastName')" class="error-message">
                                {{ errorBag.getNested("lastName") }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col mb-4">
                    <label class="mb-3 font-medium text-gray-700 text-md">
                        Birthdate
                    </label>
                    <birth-date-picker v-model:birth-date="accountBirthdate" />
                    <p v-if="errorBag.hasNested('birthDate')" class="error-message">{{ errorBag.getNested("birthDate") }}</p>
                </div>
                <div class="flex flex-col mb-4">
                    <label class="mb-3 font-medium text-gray-700 text-md">
                        Adress
                    </label>
                    <p v-if="errorBag.hasNested('address')" class="error-message">{{ errorBag.getNested("address") }}</p>
                    <div class="flex flex-col w-full">
                        <label class="text-sm text-gray-700">Country</label>
                        <select
                            id="country"
                            v-model="accountAddress.country"
                            class="w-1/2 mb-4 form-select input-select"
                            :class="{ error: errorBag.hasNested('country') }"
                        >
                            <option :value="''">Select a Country</option>
                            <option v-for="vcountry in countries" :id="'country-' + vcountry" :key="vcountry">{{ vcountry }}</option>
                        </select>
                        <p v-if="errorBag.hasNested('country')" class="error-message">{{ errorBag.getNested("country") }}</p>
                    </div>
                    <div class="flex flex-row">
                        <div class="flex flex-col w-full pr-2 mb-4">
                            <label class="text-sm text-gray-700">Street</label>
                            <input
                                id="street"
                                v-model="accountAddress.street"
                                type="text"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.hasNested('street') }"
                                placeholder="Street"
                            />
                            <p v-if="errorBag.hasNested('street')" class="error-message">
                                {{ errorBag.getNested("street") }}
                            </p>
                        </div>
                        <div class="flex flex-col pl-2">
                            <label class="text-sm text-gray-700">Number</label>
                            <input
                                id="houseNumber"
                                v-model="accountAddress.houseNumber"
                                type="text"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.hasNested('houseNumber') }"
                                placeholder="Number"
                            />
                            <p v-if="errorBag.hasNested('houseNumber')" class="error-message">
                                {{ errorBag.getNested("houseNumber") }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-row">
                        <div class="flex flex-col pr-2">
                            <label class="text-sm text-gray-700">Zip Code</label>
                            <input
                                id="zipCode"
                                v-model="accountAddress.zipCode"
                                type="text"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.hasNested('zipCode') }"
                                placeholder="Zip Code"
                            />
                            <p v-if="errorBag.hasNested('zipCode')" class="error-message">
                                {{ errorBag.getNested("zipCode") }}
                            </p>
                        </div>
                        <div class="flex flex-col w-full pl-2">
                            <label class="text-sm text-gray-700">City</label>
                            <input
                                id="city"
                                v-model="accountAddress.city"
                                type="text"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.hasNested('city') }"
                                placeholder="City"
                            />
                            <p v-if="errorBag.hasNested('city')" class="error-message">{{ errorBag.getNested("city") }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/ModelWrapper";
    import { Country } from "@/entities/Country";
    import ErrorBag from "@/use/ErrorBag";
    import BirthDatePicker from "../../BirthDatePicker.vue";
    import { ref, watch } from "vue";

    export default {
        name: "RoleSection",
        components: {
            BirthDatePicker,
        },
        props: {
            errorBag: {
                type: ErrorBag,
                required: true,
            },
            editMode: {
                type: Boolean,
                required: true,
            },
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            birthDate: {
                type: String,
                required: true,
            },
            address: {
                type: Object,
                required: true,
            },
        },

        emits: ["update:birthDate", "update:address", "update:firstName", "update:lastName"],
        setup(props: any, { emit }: any) {
            let countries = Object.values(Country).filter((e) => e != Country.NONE);
            let accountBirthdate = ref(props.birthDate);
            let accountAddress = ref(props.address);

            watch(accountAddress, () => {
                emit("update:address", accountAddress.value);
            });

            return {
                countries,
                accountAddress,
                accountFirstName: useModelWrapper(props, emit, "firstName"),
                accountLastName: useModelWrapper(props, emit, "lastName"),
                accountBirthdate: useModelWrapper(props, emit, "birthDate"),
            };
        },
    };
</script>
