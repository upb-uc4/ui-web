<template>
    <transition name="fade">
        <div v-show="isVisible" class="fixed w-full h-full top-0 left-0 flex items-center justify-center">
            <div class="absolute w-full h-full bg-gray-900 opacity-25" />

            <div
                class="bg-white dark:bg-night-light absolute z-50 w-full -mt-32 md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto rounded-lg shadow-xl overflow-y-auto"
            >
                <div class="py-8 px-10">
                    <div class="flex justify-between items-center">
                        <slot name="header"></slot>
                        <button id="baseModalCancel" class="cursor-pointer z-50 focus:outline-none" @click="$emit('cancel')">
                            <svg
                                class="fill-current text-gray-600 hover:text-gray-700 dark:text-gray-300 hover:text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 18 18"
                            >
                                <path
                                    d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div class="flex mt-4">
                        <slot></slot>
                    </div>
                </div>

                <div class="bg-gray-200 dark:bg-night-base h-20 flex items-center justify-end">
                    <div class="flex justify-end mr-10">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
    import { ref } from "vue";

    export default {
        props: {
            action: {
                required: true,
                type: Object,
            },
        },
        emits: ["cancel"],
        setup(props: any) {
            const isVisible = ref(false);

            let promiseResolve: (action: typeof props.action) => void = () => {
                return;
            };

            function show() {
                isVisible.value = true;
                return new Promise(function (resolve) {
                    promiseResolve = resolve;
                });
            }

            function close(action: typeof props.action) {
                isVisible.value = false;
                promiseResolve(action);
            }

            return { isVisible, show, close };
        },
    };
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.25s;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
