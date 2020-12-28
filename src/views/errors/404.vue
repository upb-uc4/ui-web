<template>
    <div class="flex w-full sm:mt-64 mt-32 items-center">
        <div class="md:flex md:flex-row flex-col justify-center w-full">
            <div class="sm:mr-12 lg:mr-24 text-6xl font-semibold text-center text-gray-900 dark:text-blue-600" style="font-size: 90px">
                404
            </div>

            <div class="flex flex-col justify-center">
                <div class="text-5xl font-semibold dark:text-gray-300">Page not found</div>
                <div class="mt-2 text-xl font-medium dark:text-gray-300">Unfortunately, this page does not exist 😕</div>
                <router-link id="takeMeHome" class="mt-6 flex items-center navigation-link-tmp" :to="{ name: 'home' }">
                    <span class="mr-2 text-sm font-bold">Take me home</span>
                    <i class="fas text-sm fa-chevron-right" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    export default {};
</script>
