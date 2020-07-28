<template>
    <header class="hidden md:flex lg:px-8 px-4 bg-white justify-between bg-gray-800 items-center lg:py-0 py-2 h-20">
        <div class="flex">
            <div class="flex items-center pr-8 mr-8 border-gray-100 border-r-4 my-2">
                <a href="#" class="flex text-3xl font-semibold text-gray-100 tracking-wider">
                    UC4
                </a>
            </div>

            <div class="w-auto items-center flex w-full">
                <nav>
                    <ul class="md:flex items-center justify-between font-semibold text-gray-100 tracking-wider pt-4 lg:pt-0">
                        <slot></slot>
                    </ul>
                </nav>
            </div>
        </div>
        <slot name="right"></slot>
    </header>
</template>

<script lang="ts">
    export default {
        name: "BaseNavbar",
    };
</script>
