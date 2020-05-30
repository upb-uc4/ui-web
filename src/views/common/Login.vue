<template>
    <div>
        <section class="pt-16 flex items-center justify-center bg-gray-100">
            <div class="container">
                <div>
                    <h1 class="text-5xl font-bold text-gray-900 text-center">Choose Your Role</h1>
                </div>
                <div class="md:flex w-full h-screen">
                    <div class="md:w-1/2 bg-red-300 text-gray-900 flex items-center justify-center cursor-pointer hover:bg-red-500" @click="goto('/student')">
                        <h1 class="text-6xl">Student</h1>
                    </div>

                    <div id="test" class="md:w-1/2 bg-blue-300 text-gray-900 flex items-center justify-center cursor-pointer hover:bg-blue-500" @click="goto('/lecturer')">
                        <h1 class="text-6xl">Lecturer</h1>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import Router from "../../router/";
export default {
    name: 'Login',
    methods: {
        goto: function(target : string) {
            Router.push(target);
        },
    }
}
</script>
