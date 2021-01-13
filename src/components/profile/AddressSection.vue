<template>
    <BaseSection
        title="Address"
        subtitle="Please keep your address information as up to date as possible. This is the address where official mail will be sent to."
    >
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Country</label>
                    <Select :id="'country'" v-model:elements="countries" v-model:selection="country" :disabled="false" />
                    <label v-if="errorBag.hasNested('country')" class="input-label-error">{{ errorBag.getNested("country") }}</label>
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">City</label>
                    <base-input
                        v-model="city"
                        identifier="city"
                        :error-message="getErrorMessage(errorBag, 'city', true)"
                        type="text"
                        placeholder="City"
                        validation-query="address.city"
                        class="w-full"
                    />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Postal Code</label>
                    <base-input
                        v-model="zipCode"
                        identifier="zipCode"
                        :error-message="getErrorMessage(errorBag, 'zipCode', true)"
                        type="text"
                        class="w-full"
                        validation-query="address.zipCode"
                        placeholder="Zip Code"
                    />
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">Street</label>
                    <base-input
                        v-model="street"
                        identifier="street"
                        :error-message="getErrorMessage(errorBag, 'street', true)"
                        type="text"
                        placeholder="Street"
                        class="w-full"
                        validation-query="address.street"
                    />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label">House Number</label>
                    <base-input
                        v-model="houseNumber"
                        identifier="houseNumber"
                        :error-message="getErrorMessage(errorBag, 'houseNumber', true)"
                        type="text"
                        placeholder="House Number"
                        class="w-full"
                        validation-query="address.houseNumber"
                    />
                </div>
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseInput from "@/components/common/BaseInput.vue";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import Select from "@/components/common/Select.vue";
    import { useObjectModelWrapper } from "@/use/helpers/ModelWrapper";
    import { onMounted, ref } from "vue";
    import ErrorBag, { getErrorMessage } from "@/use/helpers/ErrorBag";
    import Address from "@/api/api_models/user_management/Address";
    import { useStore } from "@/use/store/store";
    import { useToast } from "@/toast";

    export default {
        name: "AddressSection",
        components: {
            BaseInput,
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
            const countries = ref([] as string[]);

            onMounted(async () => {
                const store = useStore();
                await store.getters.configuration
                    .then((config) => {
                        countries.value = config.countries;
                    })
                    .catch((reason) => {
                        const toast = useToast();
                        toast.error(reason);
                    });
            });

            return {
                countries,
                country: useObjectModelWrapper(props, emit, "address", "country"),
                city: useObjectModelWrapper(props, emit, "address", "city"),
                street: useObjectModelWrapper(props, emit, "address", "street"),
                houseNumber: useObjectModelWrapper(props, emit, "address", "houseNumber"),
                zipCode: useObjectModelWrapper(props, emit, "address", "zipCode"),
                getErrorMessage,
            };
        },
    };
</script>
