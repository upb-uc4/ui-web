<template>
    <div class="w-full">
        <section-header title="Playground Profile" />
        <profile-picture-section class="w-full" />
        <personal-section class="w-full" />
        <contact-section class="w-full" />
        <address-section v-model:address="myAddress" class="w-full" />

        <button-section>
            <template #left>
                <button type="button" class="sm:w-32 w-full btn-secondary-remove-tmp">Delete</button>
            </template>
            <template #right>
                <button class="sm:w-32 w-full btn-secondary-tmp">Cancel</button>
                <button class="sm:w-48 w-full btn-tmp">Create Account</button>
            </template>
        </button-section>
    </div>
</template>

<script lang="ts">
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import PersonalSection from "@/components/common/dev/playground/PersonalSection.vue";
    import AddressSection from "@/components/common/dev/playground/AddressSection.vue";
    import ProfilePictureSection from "@/components/common/dev/playground/ProfilePictureSection.vue";
    import ContactSection from "@/components/common/dev/playground/ContactSection.vue";
    import { ref } from "vue";
    import Address from "@/api/api_models/user_management/Address";

    export default {
        name: "Playground",
        components: {
            SectionHeader,
            ProfilePictureSection,
            PersonalSection,
            AddressSection,
            ContactSection,
            ButtonSection,
        },
        setup() {
            const address = {
                street: "Some street",
                houseNumber: "9",
                zipCode: "947589",
                city: "NoCity",
                country: "Germany",
            } as Address;
            const myAddress = ref(address);

            return { myAddress };
        },
    };
</script>
