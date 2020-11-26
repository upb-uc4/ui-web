<template>
    <div class="flex items-baseline w-full">
        <div v-for="(vrole, index) in roles" :key="vrole" class="w-full">
            <button
                :id="'role-' + vrole"
                class="px-2 py-2 w-full text-gray-800 bg-gray-100 border-gray-200 shadow-md focus:outline-none hover:bg-blue-200"
                :class="{
                    'bg-blue-300 text-white hover:bg-blue-300 shadow-inner': selectedRole === vrole,
                    'rounded-l': index === 0,
                    'rounded-r': index === roles.length - 1,
                }"
                @click="select(vrole)"
            >
                {{ vrole }}
            </button>
        </div>
        <div class="flex w-full ml-3 items-center justify-end">
            <input id="toggleInactive" v-model="showInactiveAccounts" type="checkbox" class="m-2" />
            <label class="text-sm text-gray-700">inactive</label>
        </div>
    </div>
</template>
<script lang="ts">
    import { Role } from "@/entities/Role";
    import { ref } from "vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";

    export default {
        name: "RoleFilter",
        props: {
            selectedRole: {
                type: String,
                required: true,
            },
            showInactive: {
                type: Boolean,
                default: false,
            },
        },
        emits: ["update:selectedRole"],
        setup(props: any, { emit }: any) {
            let roles = Object.values(Role).filter((e) => e != Role.NONE);
            roles.unshift("All" as Role);

            function select(role: string) {
                emit("update:selectedRole", role);
            }

            return {
                roles,
                select,
                showInactiveAccounts: useModelWrapper(props, emit, "showInactive"),
            };
        },
    };
</script>
