<template>
    <div class="w-full lg:mt-16 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="back" class="flex items-center mb-4 navigation-link">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <div class="flex items-end justify-between">
            <h1 class="text-2xl font-medium text-gray-700 mb-8">{{firstName + " " + lastName}}</h1>
            <img class="w-32 h-32 mb-4 rounded-full object-cover"
                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsZsJ3BZuN_DlUM3OBlxrb43heJhRAXhQ9_w&usqp=CAU">
        </div>

        <div>
            <personal-section
                    v-model:firstName="firstName"
                    v-model:lastName="lastName"
            />

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-6">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Contact</label>
                        <label class="block text-gray-600">
                            How can we reach you?
                        </label>
                    </div>

                    <div class="w-full lg:w-2/3">
                        <div class="mb-6 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Email</label>
                            <input placeholder="my@email.com"  type="text" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>

                        <div class="mb-6 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Phone</label>
                            <input placeholder="+123 456 789" type="text" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-6">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Address</label>
                        <label class="block text-gray-600">
                            Please keep your address information as up to date as possible.
                        </label>
                    </div>

                    <div class="w-full lg:w-2/3">
                        <div class="mb-6 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Country</label>
                            <select class="w-full form-select block border-2 border-gray-400 rounded-lg text-gray-600 py-3">
                                <option>Germany</option>
                                <option selected>United States</option>
                            </select>
                        </div>

                        <div class="lg:flex mb-6">
                            <div class="lg:w-2/3 mb-6 lg:mb-0 flex flex-col lg:mr-16">
                                <label class="text-gray-700 text-md font-medium mb-3">City</label>
                                <input placeholder="London" type="text" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                            </div>
                            <div class="lg:w-1/3 mb-6 lg:mb-0 flex flex-col">
                                <label class="text-gray-700 text-md font-medium mb-3">Postal Code</label>
                                <input placeholder="12345" type="text" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                            </div>
                        </div>

                        <div class="mb-6 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Street</label>
                            <input placeholder="Second Street 44" type="text" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Course of Study</label>
                        <label class="block text-gray-600">
                            Information related to your individual academic career.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-6 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Field of Study</label>
                            <input placeholder="Computer Science" type="number" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                        <div class="mb-6 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Degree Sought</label>
                            <input placeholder="Master's Degree" type="number" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                        <div class="mb-6 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Semester Count</label>
                            <input placeholder="4" type="number" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Notifications</label>
                        <label class="block text-gray-600">
                            Control when and how to stay updated about recent activities.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-6 flex items-start">
                            <input class="mt-2 w-6 h-6 form-checkbox text-blue-600" type="checkbox" checked>
                            <div class="ml-6 flex flex-col">
                                <label class="text-gray-700 text-lg font-medium">Course Activity</label>
                                <label class="text-gray-600">Get important notifications about the courses you are enrolled in</label>
                            </div>
                        </div>
                        <div class="mb-6 flex items-start">
                            <input class="mt-2 w-6 h-6 form-checkbox text-blue-600" type="checkbox" checked>
                            <div class="ml-6 flex flex-col">
                                <label class="text-gray-700 text-lg font-medium">Some Other Stuff</label>
                                <label class="text-gray-600">This was just an idea. Feel free to delete it.</label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Security</label>
                        <label class="block text-gray-600">
                            This is some long detailed description which is part towards a better form.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-6 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Password</label>
                            <input placeholder="This should be a button to prompt for a password change in a different window"
                                   type="text" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                    </div>
                </div>
            </section>

        </div>
    </div>
</template>

<script lang="ts">
    import PersonalSection from "@/components/profile/PersonalSection.vue";
    export default {
        components: {
            PersonalSection
        },
        setup() {
            const firstName = "Donald"
            const lastName = "Duck"
            return {firstName, lastName};
        }
    }
</script>