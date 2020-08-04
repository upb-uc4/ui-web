<template>
    <div class="flex items-baseline w-1/2 mb-3">
        <div v-for="(vrole,index) in roles" :key="vrole" class="mb-3">
            <label class="inline-flex">
                <button 
                    class="px-4 py-2 text-gray-800 bg-gray-400 border-gray-500 shadow-sm outline-none hover:bg-gray-500" 
                    :class="{ 'bg-gray-500 shadow-none' : selectedRole == vrole , 'rounded-l' : index == 0, 'rounded-r' : index == roles.length-1}" @click="select(vrole)">
                    {{vrole}}
                </button>
            </label>
        </div>
    </div> 
</template>
<script lang="ts">
import Vue from 'vue'
    import { Role } from "@/entities/Role"
    
    export default {
        name: "RoleFilter",
        props: {
            selectedRole: {
                type: String,
                required: true
            }
        },
        emits: [
            "update:selectedRole"
        ],
        setup(props:any, { emit }: any) {
            let roles = Object.values(Role).filter(e => e != Role.NONE);
            roles.unshift("All" as Role)

            function select(role:string) {
                emit("update:selectedRole", role);
            }

            return {
                roles, select
            }
        }
    }
</script>