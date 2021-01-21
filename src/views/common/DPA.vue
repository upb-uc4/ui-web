<template>
    <base-view class="max-w-screen-lg mx-auto">
        <div class="w-full text-justify">
            <div class="flex flex-col items-center justify-center w-full mt-20 mb-8">
                <img src="../../assets/logo/logo_long_title_right.svg" alt="" />
            </div>
            <h2 class="block text-gray-800 dark:text-gray-300 text-lg font-medium mb-1">Data Protection Agreement</h2>
            <h3 class="block text-gray-600 dark:text-gray-500 text-sm leading-relaxed">
                This application is a result of an educational project group within the master program of
                <a
                    class="navigation-link cursor-pointer hover:underline"
                    target="_blank"
                    rel="noreferrer"
                    href="https://cs.uni-paderborn.de/en/studies/degree-programs/computer-science/"
                >
                    Paderborn University
                </a>
                . Please refer to the legal notice of the university.
            </h3>
        </div>
    </base-view>
</template>

<script lang="ts">
    import BaseView from "@/views/common/BaseView.vue";
    export default {
        components: { BaseView },
    };
</script>
