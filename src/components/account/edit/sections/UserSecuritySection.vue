<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Security</label>
                <label class="block text-gray-600"> Manage the authentication credentials and security related options. </label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="flex flex-col mb-4">
                    <label class="mb-3 font-medium text-gray-700 text-md">Username</label>
                    <base-input
                        v-model:value="accountUsername"
                        identifier="userName"
                        :error-message="getErrorMessage(errorBag, 'username', true)"
                        type="text"
                        class="w-full"
                        placeholder="Username"
                        :readonly="editMode"
                        validation-query="user.username"
                    />
                </div>
                <div class="flex flex-col mb-4">
                    <label class="mb-3 font-medium text-gray-700 text-md">Email</label>
                    <base-input
                        v-model:value="accountEmail"
                        identifier="email"
                        :error-message="getErrorMessage(errorBag, 'email', true)"
                        type="text"
                        placeholder="example@mail.com"
                        validation-query="user.email"
                    />
                </div>
                <div class="flex flex-col mb-4">
                    <label class="mb-3 font-medium text-gray-700 text-md">Phone Number</label>
                    <base-input
                        v-model:value="accountPhoneNumber"
                        identifier="phoneNumber"
                        :error-message="getErrorMessage(errorBag, 'phoneNumber', true)"
                        type="text"
                        placeholder="+49123456789"
                        validation-query="user.phoneNumber"
                    />
                </div>
                <div v-if="!editMode" class="flex flex-col mb-4">
                    <label for="password" class="mb-3 font-medium text-gray-700 text-md"> Password </label>
                    <base-input
                        v-model:value="accountPassword"
                        :error-message="getErrorMessage(errorBag, 'password', true)"
                        identifier="password"
                        type="text"
                        placeholder="Password"
                        validation-query="authenticationUser.password"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag, { getErrorMessage } from "@/use/helpers/ErrorBag";
    import BaseInput from "@/components/common/BaseInput.vue";

    export default {
        name: "RoleSection",
        components: {
            BaseInput,
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
                getErrorMessage,
                accountUsername: useModelWrapper(props, emit, "username"),
                accountEmail: useModelWrapper(props, emit, "email"),
                accountPhoneNumber: useModelWrapper(props, emit, "phonenumber"),
                accountPassword: useModelWrapper(props, emit, "password"),
            };
        },
    };
</script>
