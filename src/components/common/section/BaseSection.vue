<template>
    <section class="border-t-2 py-8 border-gray-300">
        <div class="md:flex">
            <div class="w-full lg:w-1/3 md:block mr-12 mb-4">
                <label class="block text-gray-600 text-lg font-medium mb-2">{{ title }}</label>
                <label class="block text-gray-500">{{ subtitle }}</label>
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
