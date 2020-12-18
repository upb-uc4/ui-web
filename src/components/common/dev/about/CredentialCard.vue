<template>
    <div class="w-56 rounded-md border-gray-200 border h-32 p-4 space-y-4 mx-auto md:mx-0">
        <div class="font-medium text-lg">
            <span class="text-2xl mr-1">{{ emoji }}</span> {{ title }}
        </div>
        <div class="text-sm">
            <div class="flex">
                <div class="text-gray-700 w-20 select-none">Username:</div>
                <div>{{ username }}</div>
            </div>
            <div class="flex">
                <div class="text-gray-700 w-20 select-none">Password:</div>
                <div>{{ password }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: "CredentialCard",
        props: {
            title: {
                type: String,
                required: true,
            },
            emoji: {
                type: String,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
        },
    };
</script>
