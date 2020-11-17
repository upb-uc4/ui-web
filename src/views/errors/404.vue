<template>
    <div class="flex w-full sm:mt-64 mt-32 items-center">
        <div class="md:flex md:flex-row flex-col justify-center w-full">
            <div class="sm:mr-12 lg:mr-24 text-6xl font-semibold text-center text-blue-700" style="font-size: 96px">404</div>

            <div class="flex flex-col justify-center">
                <div class="text-5xl font-bold text-blue-700">Oops...</div>
                <div class="text-xl font-medium">Unfortunately, this page does not exist :(</div>
                <div class="mt-10 text-xl font-medium">
                    <router-link id="takeMeHome" :to="{ name: 'home' }" class="w-full sm:w-auto block sm:inline p-3 btn btn-blue-secondary">
                        Take me Home
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    export default {};
</script>
