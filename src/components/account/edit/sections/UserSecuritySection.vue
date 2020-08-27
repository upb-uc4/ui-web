<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">User Security</label>
                <label class="block text-gray-600"> Basic Information of the User for Authentication </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="flex flex-col mb-4">
                    <label class="mb-3 font-medium text-gray-700 text-md">Username</label>
                    <input
                        id="userName"
                        v-model="accountUsername"
                        type="text"
                        class="w-full form-input input-text"
                        :class="{ error: errorBag.hasNested('username') }"
                        placeholder="Username"
                        :readonly="editMode"
                    />
                    <p v-if="errorBag.hasNested('username')" class="error-message">{{ errorBag.getNested("username") }}</p>
                </div>
                <div class="flex flex-col mb-4">
                    <label class="mb-3 font-medium text-gray-700 text-md">Email</label>
                    <input
                        id="email"
                        v-model="accountEmail"
                        type="text"
                        class="w-full form-input input-text"
                        :class="{ error: errorBag.hasNested('email') }"
                        placeholder="example@mail.com"
                    />
                    <p v-if="errorBag.hasNested('email')" class="error-message">{{ errorBag.getNested("email") }}</p>
                </div>
                <div class="flex flex-col mb-4">
                    <label class="mb-3 font-medium text-gray-700 text-md">Phone Number (optional)</label>
                    <input
                        id="phoneNumber"
                        v-model="accountPhoneNumber"
                        type="text"
                        class="w-full form-input input-text"
                        :class="{ error: errorBag.hasNested('phoneNumber') }"
                        placeholder="+49123456789"
                    />
                    <p v-if="errorBag.hasNested('phoneNumber')" class="error-message">{{ errorBag.getNested("phoneNumber") }}</p>
                </div>
                <div v-if="!editMode" class="flex flex-col mb-4">
                    <label for="password" class="mb-3 font-medium text-gray-700 text-md"> Password </label>
                    <input
                        id="password"
                        v-model="accountPassword"
                        type="text"
                        class="w-full form-input input-text"
                        :class="{ error: errorBag.hasNested('password') }"
                        placeholder="Password"
                    />
                    <p v-if="errorBag.hasNested('password')" class="error-message">{{ errorBag.getNested("password") }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        name: "RoleSection",
        props: {
            errorBag: {
                type: ErrorBag,
                required: true,
            },
            editMode: {
                type: Boolean,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            phonenumber: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
        },
        emits: ["update:username", "update:email", "update:password", "update:phonenumber"],
        setup(props: any, { emit }: any) {
            return {
                accountUsername: useModelWrapper(props, emit, "username"),
                accountEmail: useModelWrapper(props, emit, "email"),
                accountPhoneNumber: useModelWrapper(props, emit, "phonenumber"),
                accountPassword: useModelWrapper(props, emit, "password"),
            };
        },
    };
</script>
