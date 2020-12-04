<template>
    <BaseSection
        title="Address"
        subtitle="Please keep your address information as up to date as possible. This is the address where official mail will be sent to."
    >
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Country</label>
                    <Select v-model:elements="countries" :selected-element="selectedCountry" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">City</label>
                    <input type="text" class="w-full input-text-tmp" readonly value="Hamburg" />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Postal Code</label>
                    <input type="text" class="w-full input-text-tmp" readonly value="22041" />
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Street</label>
                    <input type="text" class="w-full input-text-tmp" readonly value="Bakerstreet" />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">House Number</label>
                    <input type="text" class="w-full input-text-tmp" readonly value="221b" />
                </div>
            </div>
        </div>
    </BaseSection>
</template>

<script>
    import BaseSection from "@/components/common/section/BaseSection";
    import Select from "@/components/common/Select";
    import { ref } from "vue";

    export default {
        name: "InputSection",
        components: {
            BaseSection,
            Select,
        },
        setup() {
            const countries = ["Germany", "France", "United Kingdom"];
            const selectedCountry = ref(countries[0]);
            return { countries, selectedCountry };
        },
    };
</script>
