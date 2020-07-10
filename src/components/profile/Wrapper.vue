<template>
    <suspense>
        <template #default>
            <private-profile v-if="isPrivate"/>
        </template>
        <template #fallback>
            <p class="text-center text-lg pt-20">
                Loading Profile...
            </p>
        </template>
    </suspense>
</template>

<script lang="ts">
    import PrivateProfile from "../../views/common/PrivateProfile.vue";

    export default {
        props: {
            isPrivate: {
                required: true,
                type: Boolean,
            }
        },
        components: {
            PrivateProfile,
        }
    }
</script>