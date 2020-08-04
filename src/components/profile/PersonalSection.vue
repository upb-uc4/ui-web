<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-lg font-medium text-gray-700">Personal Information</label>
                </div>
                <label class="block text-gray-600">
                    This is some long detailed description which is part towards a better form.
                </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-6 lg:flex">
                    <div class="flex flex-col mb-6 lg:w-1/2 lg:mb-0 lg:mr-16">
                        <label class="mb-3 font-medium text-gray-700 text-md">First Name</label>
                        <input id="firstName" :value="firstName" type="text" readonly class="w-full input-text form-input" />
                    </div>
                    <div class="flex flex-col mb-6 lg:w-1/2 lg:mb-0">
                        <label class="mb-3 font-medium text-gray-700 text-md">Last Name</label>
                        <input id="lastName" :value="lastName" type="text" readonly class="w-full input-text form-input" />
                    </div>
                </div>
                <div class="flex flex-col mb-6 lg:w-1/2 lg:pr-8">
                    <label class="mb-3 font-medium text-gray-700 text-md">Date of Birth</label>
                    <input id="birthDate" type="text" readonly :value="shownBirthDate" class="w-full input-text form-input" />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { ref, reactive } from "vue";
    import { Month } from "@/entities/Month.ts";

    export default {
        props: {
            firstName: {
                required: true,
                type: String,
            },
            lastName: {
                required: true,
                type: String,
            },
            birthDate: {
                required: true,
                type: String,
            },
        },

        setup(props: any) {
            let birthDateDates = props.birthDate.split("-");
            let shownBirthDate = birthDateDates[2] + ". " + Object.values(Month)[parseInt(birthDateDates[1]) - 1] + " " + birthDateDates[0];

            return { shownBirthDate };
        },
    };
</script>
