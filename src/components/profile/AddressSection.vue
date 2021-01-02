<template>
    <BaseSection
        title="Address"
        subtitle="Please keep your address information as up to date as possible. This is the address where official mail will be sent to."
    >
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Country</label>
                    <Select :id="'country'" v-model:elements="countries" v-model:selection="country" :disabled="false" />
                    <label v-if="errorBag.hasNested('country')" class="input-label-error-tmp">{{ errorBag.getNested("country") }}</label>
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">City</label>
                    <input
                        id="city"
                        v-model="city"
                        type="text"
                        class="w-full"
                        :class="errorBag.hasNested('city') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.hasNested('city')" class="input-label-error-tmp">{{ errorBag.getNested("city") }}</label>
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Postal Code</label>
                    <input
                        id="zipCode"
                        v-model="zipCode"
                        type="text"
                        class="w-full"
                        :class="errorBag.hasNested('zipCode') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.hasNested('zipCode')" class="input-label-error-tmp">{{ errorBag.getNested("zipCode") }}</label>
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Street</label>
                    <input
                        id="street"
                        v-model="street"
                        type="text"
                        class="w-full"
                        :class="errorBag.hasNested('street') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.hasNested('street')" class="input-label-error-tmp">{{ errorBag.getNested("street") }}</label>
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">House Number</label>
                    <input
                        id="houseNumber"
                        v-model="houseNumber"
                        type="text"
                        class="w-full input-text-tmp"
                        :class="errorBag.hasNested('houseNumber') ? 'input-text-error-tmp' : 'input-text-tmp'"
                    />
                    <label v-if="errorBag.hasNested('houseNumber')" class="input-label-error-tmp">{{
                        errorBag.getNested("houseNumber")
                    }}</label>
                </div>
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import Select from "@/components/common/Select.vue";
    import { Country } from "@/entities/Country";
    import { useObjectModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import Address from "@/api/api_models/user_management/Address";

    export default {
        name: "AddressSection",
        components: {
            BaseSection,
            Select,
        },
        props: {
            address: {
                type: Object as () => Address,
                required: true,
            },
            errorBag: {
                type: Object as () => ErrorBag,
                required: true,
            },
        },
        emits: ["update:address"],
        setup(props: any, { emit }: any) {
            const countries = Object.values(Country).filter((e) => e !== Country.NONE);

            return {
                countries,
                country: useObjectModelWrapper(props, emit, "address", "country"),
                city: useObjectModelWrapper(props, emit, "address", "city"),
                street: useObjectModelWrapper(props, emit, "address", "street"),
                houseNumber: useObjectModelWrapper(props, emit, "address", "houseNumber"),
                zipCode: useObjectModelWrapper(props, emit, "address", "zipCode"),
            };
        },
    };
</script>
