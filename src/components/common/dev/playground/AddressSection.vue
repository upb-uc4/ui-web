<template>
    <BaseSection
        title="Address"
        subtitle="Please keep your address information as up to date as possible. This is the address where official mail will be sent to."
    >
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Country</label>
                    <Select v-model:elements="countries" v-model:selection="country" :disabled="false" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">City</label>
                    <input v-model="city" type="text" class="w-full input-text-tmp" />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Postal Code</label>
                    <input v-model="zipCode" type="text" class="w-full input-text-tmp" />
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Street</label>
                    <input v-model="street" type="text" class="w-full input-text-tmp" />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">House Number</label>
                    <input v-model="houseNumber" type="text" class="w-full input-text-tmp" />
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

    export default {
        name: "AddressSection",
        components: {
            BaseSection,
            Select,
        },
        props: {
            address: {
                type: Object,
                required: true,
            },
            errorBag: {
                type: Object,
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
