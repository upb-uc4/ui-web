<template>
    <div>
        <section-header :title="title" />
        <profile-picture-section />
        <personal-section
            v-model:first-name="admin.firstName"
            v-model:last-name="admin.lastName"
            v-model:birth-date="admin.birthDate"
            :readonly="true"
        />
        <editable-contact-section v-model:email="admin.email" v-model:phone-number="admin.phoneNumber" @save="onSave()" />
        <editable-address-section v-model:address="admin.address" @save="onSave()" />
    </div>
</template>

<script lang="ts">
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import ProfilePictureSection from "@/components/common/dev/playground/ProfilePictureSection.vue";
    import PersonalSection from "@/components/common/dev/playground/PersonalSection.vue";
    import EditableContactSection from "@/components/common/dev/playground/EditableContactSection.vue";
    import EditableAddressSection from "@/components/common/dev/playground/EditableAddressSection.vue";

    import { computed, reactive, ref } from "vue";
    import Admin from "@/api/api_models/user_management/Admin";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        components: {
            SectionHeader,
            ProfilePictureSection,
            PersonalSection,
            EditableAddressSection,
            EditableContactSection,
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
        emits: ["update:user", "save"],
        setup(props: any, { emit }: any) {
            //todo move the components to the right location once the old components are deleted
            const admin = reactive(props.user);
            const title = computed(() => `${admin.firstName} ${admin.lastName} (@${admin.username})`);

            function onSave() {
                emit("update:user", admin);
                emit("save");
            }

            return {
                title,
                admin,
                onSave,
            };
        },
    };
</script>
