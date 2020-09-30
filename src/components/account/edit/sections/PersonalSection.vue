<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Personal Information</label>
                <label class="block text-gray-600"> Personal Information and Contact Data for the User </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-6 lg:flex">
                    <div class="flex flex-col mb-6 lg:w-1/2 lg:mb-0 lg:mr-16">
                        <label class="mb-3 font-medium text-gray-700 text-md">First Name</label>
                        <input
                            id="firstName"
                            v-model="accountFirstName"
                            type="text"
                            class="w-full form-input input-text"
                            :class="{ error: errorBag.hasNested('firstName') }"
                            placeholder="Firstname"
                        />
                        <p v-if="errorBag.hasNested('firstName')" class="error-message">
                            {{ errorBag.getNested("firstName") }}
                        </p>
                    </div>
                    <div class="flex flex-col mb-6 lg:w-1/2 lg:mb-0">
                        <label class="mb-3 font-medium text-gray-700 text-md">Last Name</label>
                        <input
                            id="lastName"
                            v-model="accountLastName"
                            type="text"
                            class="w-full form-input input-text"
                            :class="{ error: errorBag.hasNested('lastName') }"
                            placeholder="Lastname"
                        />
                        <p v-if="errorBag.hasNested('lastName')" class="error-message">
                            {{ errorBag.getNested("lastName") }}
                        </p>
                    </div>
                </div>
                <div class="flex flex-col mb-4">
                    <label class="mb-3 font-medium text-gray-700 text-md"> Birthdate </label>
                    <birth-date-picker v-model:birth-date="accountBirthdate" />
                    <p v-if="errorBag.hasNested('birthDate')" class="error-message">{{ errorBag.getNested("birthDate") }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import BirthDatePicker from "../BirthDatePicker.vue";
    import { ref } from "vue";

    export default {
        name: "RoleSection",
        components: {
            BirthDatePicker,
        },
        props: {
            errorBag: {
                type: ErrorBag,
                required: true,
            },
            editMode: {
                type: Boolean,
                required: true,
            },
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            birthDate: {
                type: String,
                required: true,
            },
        },

        emits: ["update:birthDate", "update:firstName", "update:lastName"],
        setup(props: any, { emit }: any) {
            let accountBirthdate = ref(props.birthDate);

            return {
                accountFirstName: useModelWrapper(props, emit, "firstName"),
                accountLastName: useModelWrapper(props, emit, "lastName"),
                accountBirthdate: useModelWrapper(props, emit, "birthDate"),
            };
        },
    };
</script>
