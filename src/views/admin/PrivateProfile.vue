<template>
    <div>
        <section-header :title="title" />
        <profile-picture-section :show-own-profile="true" />
        <personal-section
            v-model:first-name="firstName"
            v-model:last-name="lastName"
            v-model:birth-date="birthDate"
            :readonly="true"
            :error-bag="errorBag"
        />
        <contact-section v-model:email="email" v-model:phone-number="phoneNumber" :error-bag="errorBag" />
        <address-section v-model:address="address" :error-bag="errorBag" />
    </div>
</template>

<script lang="ts">
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import ProfilePictureSection from "@/components/profile/ProfilePictureSection.vue";
    import PersonalSection from "@/components/profile/PersonalSection.vue";
    import ContactSection from "@/components/profile/ContactSection.vue";
    import AddressSection from "@/components/profile/AddressSection.vue";

    import { computed } from "vue";
    import Admin from "@/api/api_models/user_management/Admin";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { useObjectModelWrapper } from "@/use/helpers/ModelWrapper";

    export default {
        components: {
            SectionHeader,
            ProfilePictureSection,
            PersonalSection,
            AddressSection,
            ContactSection,
        },
        props: {
            user: {
                required: true,
                type: Object as () => Admin,
            },
            errorBag: {
                required: true,
                type: Object as () => ErrorBag,
            },
        },
        emits: ["update:user"],
        setup(props: any, { emit }: any) {
            const title = computed(() => `${props.user.firstName} ${props.user.lastName} (@${props.user.username})`);

            return {
                title,
                firstName: useObjectModelWrapper(props, emit, "user", "firstName"),
                lastName: useObjectModelWrapper(props, emit, "user", "lastName"),
                birthDate: useObjectModelWrapper(props, emit, "user", "birthDate"),
                email: useObjectModelWrapper(props, emit, "user", "email"),
                phoneNumber: useObjectModelWrapper(props, emit, "user", "phoneNumber"),
                address: useObjectModelWrapper(props, emit, "user", "address"),
            };
        },
    };
</script>
