<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Select a Role</label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="flex flex-col mb-4">
                    <div class="flex w-full">
                        <div v-for="vrole in roles" :key="vrole" class="mb-3 mr-4">
                            <label class="flex items-center">
                                <input
                                    :id="'role-' + vrole"
                                    v-model="accountRole"
                                    type="radio"
                                    class="form-radio radio"
                                    :disabled="editMode"
                                    :value="vrole"
                                />
                                <span class="ml-2 font-medium text-gray-700 text-md">{{ vrole }}</span>
                            </label>
                        </div>
                    </div>
                    <p v-if="errorBag.hasNested('role')" class="error-message">{{ errorBag.getNested("role") }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { Role } from "@/entities/Role";
    import { useModelWrapper } from "@/use/ModelWrapper";
    import ErrorBag from "@/use/ErrorBag";

    export default {
        name: "RoleSection",
        props: {
            errorBag: {
                type: ErrorBag,
                required: true,
            },
            role: {
                type: String,
                required: true,
            },
            editMode: {
                type: Boolean,
                required: true,
            },
        },

        setup(props: any, { emit }: any) {
            let roles = Object.values(Role).filter((e) => e != Role.NONE);

            return {
                roles,
                accountRole: useModelWrapper(props, emit, "role"),
            };
        },
    };
</script>
