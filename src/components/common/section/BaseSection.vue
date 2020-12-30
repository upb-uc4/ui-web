<template>
    <section class="border-t-2 py-8 border-gray-200 dark:border-normalgray-700">
        <div class="md:flex">
            <div class="w-full lg:w-1/3 md:block xl:mr-32 mr-12 mb-4">
                <label class="block text-gray-800 dark:text-gray-300 text-lg font-medium mb-2">{{ title }}</label>
                <label class="block text-gray-500 text-sm">{{ subtitle }}</label>
            </div>
            <div class="w-full lg:w-2/3">
                <slot />
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "Section",
        props: {
            title: {
                required: true,
                type: String,
            },
            subtitle: {
                required: true,
                type: String,
            },
        },
    };
</script>
