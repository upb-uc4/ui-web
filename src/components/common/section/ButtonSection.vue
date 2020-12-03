<template>
    <section class="py-8 border-t-2 border-gray-200">
        <div class="flex flex-col-reverse sm:flex-row justify-between space-y-4 space-y-reverse sm:space-y-0">
            <div class="flex items-center justify-start">
                <slot name="left" />
            </div>

            <div class="flex flex-col-reverse sm:flex-row items-center justify-end sm:space-x-10 space-y-4 space-y-reverse sm:space-y-0">
                <slot name="right" />
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "ButtonSection",
    };
</script>
