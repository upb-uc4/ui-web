<template>
    <suspense>
        <template #default>
            <profile></profile>
        </template>
        <template #fallback>
            <p class="text-center text-lg pt-20">
                Loading Profile...
            </p>
        </template>
    </suspense>
</template>

<script lang="ts">
    import Profile from "../../views/common/Profile.vue";
    export default {
        components: {
            Profile,
        }
    }
</script>