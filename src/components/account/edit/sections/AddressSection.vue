<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Address</label>
                </div>
                <label class="block text-gray-600"> Please keep your address information as up to date as possible. </label>
            </div>

            <div class="w-full lg:w-2/3">
                <div class="mb-6 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Country</label>
                    <select
                        id="country"
                        v-model="addressCopy.country"
                        class="w-full form-select input-select"
                        :class="{ error: errorBag.hasNested('country') }"
                    >
                        <option :value="''">Select a Country</option>
                        <option v-for="vcountry in countries" :id="'country-' + vcountry" :key="vcountry">{{ vcountry }}</option>
                    </select>
                    <p v-if="errorBag.hasNested('country')" class="error-message">{{ errorBag.getNested("country") }}</p>
                </div>

                <div class="lg:flex mb-6 justify-between">
                    <div class="lg:mb-0 mb-6 flex flex-col w-full lg:w-5/6 mr-3">
                        <label class="text-gray-700 text-md font-medium mb-3">City</label>
                        <input
                            id="city"
                            v-model="addressCopy.city"
                            type="text"
                            class="w-full form-input input-text"
                            :class="{ error: errorBag.hasNested('city') }"
                            placeholder="City"
                        />
                        <p v-if="errorBag.hasNested('city')" class="error-message">{{ errorBag.getNested("city") }}</p>
                    </div>
                    <div class="flex flex-col w-full lg:w-1/6">
                        <label class="text-gray-700 text-md font-medium mb-3">Postal Code</label>
                        <input
                            id="zipCode"
                            v-model="addressCopy.zipCode"
                            type="text"
                            class="w-full form-input input-text"
                            :class="{ error: errorBag.hasNested('zipCode') }"
                            placeholder="Zip Code"
                        />
                        <p v-if="errorBag.hasNested('zipCode')" class="error-message">
                            {{ errorBag.getNested("zipCode") }}
                        </p>
                    </div>
                </div>
                <div class="lg:flex flex-row justify-between mb-6">
                    <div class="lg:mb-0 mb-6 flex flex-col w-full lg:w-5/6 mr-3">
                        <label class="text-gray-700 text-md font-medium mb-3">Street</label>
                        <input
                            id="street"
                            v-model="addressCopy.street"
                            type="text"
                            class="w-full form-input input-text"
                            :class="{ error: errorBag.hasNested('street') }"
                            placeholder="Street"
                        />
                        <p v-if="errorBag.hasNested('street')" class="error-message">
                            {{ errorBag.getNested("street") }}
                        </p>
                    </div>
                    <div class="flex flex-col w-full lg:w-1/6">
                        <label class="text-gray-700 text-md font-medium mb-3">Nr.</label>
                        <input
                            id="houseNumber"
                            v-model="addressCopy.houseNumber"
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
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { Country } from "@/entities/Country";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";

    export default {
        name: "AccountAddressSection",
        props: {
            address: {
                required: true,
                type: Object,
            },
            errorBag: {
                type: ErrorBag,
                required: true,
            },
        },
        emits: ["update:address"],
        setup(props: any, { emit }: any) {
            const countries = Object.values(Country).filter((e) => e != Country.NONE);

            return {
                countries,
                addressCopy: useModelWrapper(props, emit, "address"),
            };
        },
    };
</script>
