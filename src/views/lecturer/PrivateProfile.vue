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
        <research-section v-model:free-text="freeText" v-model:research-area="researchArea" :error-bag="errorBag" />
    </div>
</template>

<script lang="ts">
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import ProfilePictureSection from "@/components/profile/ProfilePictureSection.vue";
    import PersonalSection from "@/components/profile/PersonalSection.vue";
    import ContactSection from "@/components/profile/ContactSection.vue";
    import AddressSection from "@/components/profile/AddressSection.vue";
    import ResearchSection from "@/components/profile/lecturer/ResearchSection.vue";

    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import { useObjectModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { computed } from "vue";

    export default {
        components: {
            SectionHeader,
            ProfilePictureSection,
            PersonalSection,
            ContactSection,
            AddressSection,
            ResearchSection,
        },
        props: {
            user: {
                required: true,
                type: Object as () => Lecturer,
            },
            errorBag: {
                type: Object as () => ErrorBag,
                required: true,
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
                freeText: useObjectModelWrapper(props, emit, "user", "freeText"),
                researchArea: useObjectModelWrapper(props, emit, "user", "researchArea"),
            };
        },
    };
</script>
