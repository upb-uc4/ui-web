<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Personal Information</label>
                    <button v-show="!isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="edit">Edit</button>
                    <button v-show="isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="save">Save</button>
                    <button v-show="isEditing" class="ml-4 text-sm btn-blue-tertiary" @click="cancelEdit">Cancel</button>
                </div>
                <label class="block text-gray-600">
                    This is some long detailed description which is part towards a better form.
                </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="lg:flex mb-6">
                    <div class="lg:w-1/2 mb-6 lg:mb-0 flex flex-col lg:mr-16">
                        <label class="text-gray-700 text-md font-medium mb-3">First Name</label>
                        <input v-model="modification.firstName" type="text" :readonly="!isEditing" class="w-full input-text form-input" />
                    </div>
                    <div class="lg:w-1/2 mb-6 lg:mb-0 flex flex-col">
                        <label class="text-gray-700 text-md font-medium mb-3">Last Name</label>
                        <input v-model="modification.lastName" type="text" :readonly="!isEditing" class="w-full input-text form-input" />
                    </div>
                </div>
                <div class="lg:w-1/2 mb-6 flex flex-col lg:pr-8">
                    <label class="text-gray-700 text-md font-medium mb-3">Date of Birth</label>
                    <input type="text" readonly :value="shownBirthDate" class="w-full input-text form-input" />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { ref, reactive } from "vue";
    import { Month } from "@/entities/Month.ts"

    export default {
        props: ["firstName", "lastName", "birthDate"],
        emits: ["save", "update:firstName", "update:lastName"],
        setup(props: any, { emit }: any) {
            let birthDateDates = props.birthDate.split("-");
            let shownBirthDate = birthDateDates[2] + ". " + Object.values(Month)[parseInt(birthDateDates[1])-1] + " " + birthDateDates[0];

            const modification = reactive({
                firstName: props.firstName,
                lastName: props.lastName,
            });
            const isEditing = ref(false);

            function edit() {
                isEditing.value = true;
            }

            function cancelEdit() {
                resetInputs();
                isEditing.value = false;
            }

            function resetInputs() {
                modification.firstName = props.firstName;
                modification.lastName = props.lastName;
            }

            function save() {
                isEditing.value = false;
                emit("update:firstName", modification.firstName);
                emit("update:lastName", modification.lastName);
                emit("save");
            }

            return { isEditing, edit, cancelEdit, save, modification, shownBirthDate};
        },
    };
</script>
