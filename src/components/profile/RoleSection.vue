<template>
    <base-section
        title="Role"
        subtitle="Select the appropriate role for this user. Each role has a different access level which in turn unlocks certain features."
    >
        <div class="w-full">
            <div id="roleSelection" class="flex w-full">
                <div v-for="vrole in roles" :key="vrole" class="mr-6">
                    <label class="flex items-center">
                        <input
                            :id="'role-' + vrole"
                            v-model="accountRole"
                            type="radio"
                            class="form-radio radio"
                            :disabled="editMode"
                            :value="vrole"
                        />
                        <span class="ml-2 mt-1 input-label-tmp">{{ vrole }}</span>
                    </label>
                </div>
            </div>
            <label v-if="errorBag.hasNested('role')" class="input-label-error-tmp">{{ errorBag.getNested("role") }}</label>
        </div>
    </base-section>
</template>

<script lang="ts">
    import { Role } from "@/entities/Role";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import BaseSection from "@/components/common/section/BaseSection.vue";

    export default {
        name: "RoleSection",
        components: {
            BaseSection,
        },
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
        emits: ["update:role"],
        setup(props: any, { emit }: any) {
            let roles = Object.values(Role).filter((e) => e != Role.NONE);

            return {
                roles,
                accountRole: useModelWrapper(props, emit, "role"),
            };
        },
    };
</script>
