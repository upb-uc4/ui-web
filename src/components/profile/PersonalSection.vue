<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-gray-700 text-lg font-medium">Personal Information</label>
                    <button class="ml-4 text-sm btn-blue-tertiary" @click="toggleEdit">{{ buttonText }}</button>
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
                        <input type="text" :readonly="!isEditing" :value="firstName"
                               :class="{'bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400' : !isEditing}"
                               class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                    </div>
                    <div class="lg:w-1/2 mb-6 lg:mb-0 flex flex-col">
                        <label class="text-gray-700 text-md font-medium mb-3">Last Name</label>
                        <input type="text" :readonly="!isEditing" :value="lastName"
                               :class="{'bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400' : !isEditing}"
                               class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">

                    </div>
                </div>
                <div class="lg:w-1/2 mb-6 flex flex-col lg:pr-8">
                    <label class="text-gray-700 text-md font-medium mb-3">Date of Birth</label>
                    <input type="text" readonly placeholder="22.04.1984"
                           class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input placeholder-gray-600 bg-gray-300 focus:outline-none focus:shadow-none focus:border-gray-400">
                </div>
            </div>

        </div>
    </section>
</template>

<script lang="ts">
    import {ref, computed} from "vue";

    export default {
        props: ["firstName", "lastName", "birthdate"],

        setup(props: any) {
            const test = ref(props.firstName);

            const isEditing = ref(false);
            const buttonText = computed( () => {
               return isEditing.value ? "Save" : "Edit";
            });

            function toggleEdit() {
                isEditing.value =! isEditing.value;
            }

            function cancelEdit() {
                //reset data
                isEditing.value = false;
            }

            return {isEditing, toggleEdit, buttonText, cancelEdit, test};
        }
    }
</script>