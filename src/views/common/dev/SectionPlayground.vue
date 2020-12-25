<template>
    <div v-if="busy" class="flex justify-center items-center">
        <spinner />
    </div>
    <div v-else class="w-full">
        <section-header title="Playground Profile" />
        <profile-picture-section class="w-full" />
        <personal-section
            v-model:first-name="myUser.firstName"
            v-model:last-name="myUser.lastName"
            v-model:birth-date="myUser.birthDate"
            class="w-full"
        />
        <contact-section v-model:email="myUser.email" v-model:phone-number="myUser.phoneNumber" class="w-full" />
        <address-section v-model:address="myUser.address" class="w-full" />

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
    import Spinner from "@/components/common/loading/Spinner.vue";
    import { onBeforeMount, ref } from "vue";
    import { Role } from "@/entities/Role";
    import Address from "@/api/api_models/user_management/Address";
    import User from "@/api/api_models/user_management/User";
    import Student from "@/api/api_models/user_management/Student";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import Admin from "@/api/api_models/user_management/Admin";
    import UserManagement from "@/api/UserManagement";
    import ProfileResponseHandler from "@/use/helpers/ProfileResponseHandler";

    export default {
        name: "Playground",
        components: {
            SectionHeader,
            ProfilePictureSection,
            PersonalSection,
            AddressSection,
            ContactSection,
            ButtonSection,
            Spinner,
        },
        setup() {
            const address = {
                street: "Some street",
                houseNumber: "9",
                zipCode: "947589",
                city: "NoCity",
                country: "Germany",
            } as Address;

            const oldUser = {
                username: "maxmustermann",
                role: Role.STUDENT,
                address: address,
                firstName: "Max",
                lastName: "Mustermann",
                email: "example@cs.uc4.upb.de",
                birthDate: "06-07-1993",
                phoneNumber: "+0900666666",
                enrollmentIdSecret: "asdklfjlk;sdjgkjasdlk;fj",
                isActive: true,
            } as User;

            const myUser = ref({} as Student | Lecturer | Admin);
            const busy = ref(true);

            onBeforeMount(async () => {
                await getUser();
            });

            async function getUser() {
                busy.value = true;
                const auth: UserManagement = new UserManagement();
                const responseHandler = new ProfileResponseHandler();
                const response = await auth.getOwnUser();
                const result = responseHandler.handleResponse(response);
                if (result) {
                    myUser.value = result;
                }
                busy.value = false;
            }

            return {
                myUser,
                busy,
            };
        },
    };
</script>
