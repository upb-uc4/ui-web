<template>
    <div class="md:flex h-screen p-8 text-gray-800 dark:text-gray-300 text-sm">
        <div class="md:w-1/3 lg:w-1/5 mr-8">
            <div class="space-y-1">
                <div class="flex justify-between rounded-md p-2.5 hover:bg-gray-200 dark:hover:bg-normalgray-900 cursor-pointer">
                    <div class="flex items-center space-x-4">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                            />
                        </svg>
                        <span>Inbox</span>
                    </div>
                    <div>8</div>
                </div>
                <div class="flex justify-between rounded-md p-2.5 hover:bg-gray-200 dark:hover:bg-normalgray-900 cursor-pointer">
                    <div class="flex items-center space-x-4">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </svg>
                        <span>Saved</span>
                    </div>
                    <div class="hidden">7</div>
                </div>
                <div class="flex justify-between rounded-md p-2.5 hover:bg-gray-200 dark:hover:bg-normalgray-900 cursor-pointer">
                    <div class="flex items-center space-x-4">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Done</span>
                    </div>
                    <div class="hidden">10</div>
                </div>
            </div>
            <hr class="my-6 dark:border-normalgray-700" />
            <div>
                <h3 class="font-semibold">Filters</h3>
                <div class="mt-4 space-y-1">
                    <div
                        class="flex justify-between rounded-md p-2.5 cursor-pointer bg-blue-600 text-white dark:bg-blue-800 dark:text-gray-300"
                    >
                        <div class="flex items-center space-x-4">
                            <span>👀</span>
                            <span>Action required</span>
                        </div>
                        <div>4</div>
                    </div>
                    <div class="flex justify-between rounded-md p-2.5 hover:bg-gray-200 dark:hover:bg-normalgray-900 cursor-pointer">
                        <div class="flex items-center space-x-4">
                            <span>🎯</span>
                            <span>Immatriculation</span>
                        </div>
                        <div>1</div>
                    </div>
                </div>
            </div>
            <hr class="my-6 dark:border-normalgray-700" />
        </div>
        <div class="w-full md:w-2/3 lg:w-4/5">
            <div class="w-full xl:w-1/2">
                <search-bar v-model:message="searchText" placeholder="Search Notifications..." />
            </div>
            <div class="mt-4 rounded-md border dark:border-normalgray-700 bg-gray-50 dark:bg-normalgray-900">
                <!-- no for loop as linter started crying about unused variable in for loop -->
                <div class="flex justify-between items-center p-4">
                    <div class="flex items-center space-x-4">
                        <span class="w-2 h-2 rounded-full bg-blue-700" />
                        <div class="">
                            <div class="text-xs text-gray-500">Matriculation</div>
                            <div>Pending Matriculation 001</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-16">
                        <div class="hidden lg:block">
                            <div class="text-xs text-gray-500">created by</div>
                            <div class="navigation-link">Prof. Dr. Mock</div>
                        </div>
                        <div class="flex space-x-2">
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-green-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-red-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="hidden md:hidden lg:block sm:block text-gray-500">6 days ago</div>
                    </div>
                </div>
                <hr class="dark:border-normalgray-700" />
                <div class="flex justify-between items-center p-4">
                    <div class="flex items-center space-x-4">
                        <span class="w-2 h-2 rounded-full bg-blue-700" />
                        <div class="">
                            <div class="text-xs text-gray-500">Matriculation</div>
                            <div>Pending Matriculation 001</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-16">
                        <div class="hidden lg:block">
                            <div class="text-xs text-gray-500">created by</div>
                            <div class="navigation-link">Prof. Dr. Mock</div>
                        </div>
                        <div class="flex space-x-2">
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-green-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-red-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="hidden md:hidden lg:block sm:block text-gray-500">6 days ago</div>
                    </div>
                </div>
                <hr class="dark:border-normalgray-700" />
                <div class="flex justify-between items-center p-4">
                    <div class="flex items-center space-x-4">
                        <span class="w-2 h-2 rounded-full bg-blue-700" />
                        <div class="">
                            <div class="text-xs text-gray-500">Matriculation</div>
                            <div>Pending Matriculation 001</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-16">
                        <div class="hidden lg:block">
                            <div class="text-xs text-gray-500">created by</div>
                            <div class="navigation-link">Prof. Dr. Mock</div>
                        </div>
                        <div class="flex space-x-2">
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-green-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-red-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="hidden md:hidden lg:block sm:block text-gray-500">6 days ago</div>
                    </div>
                </div>
                <hr class="dark:border-normalgray-700" />
                <div class="flex justify-between items-center p-4">
                    <div class="flex items-center space-x-4">
                        <span class="w-2 h-2 rounded-full bg-blue-700" />
                        <div class="">
                            <div class="text-xs text-gray-500">Matriculation</div>
                            <div>Pending Matriculation 001</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-16">
                        <div class="hidden lg:block">
                            <div class="text-xs text-gray-500">created by</div>
                            <div class="navigation-link">Prof. Dr. Mock</div>
                        </div>
                        <div class="flex space-x-2">
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-green-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-red-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="hidden md:hidden lg:block sm:block text-gray-500">6 days ago</div>
                    </div>
                </div>
                <hr class="dark:border-normalgray-700" />
                <div class="flex justify-between items-center p-4">
                    <div class="flex items-center space-x-4">
                        <span class="w-2 h-2 rounded-full bg-blue-700" />
                        <div class="">
                            <div class="text-xs text-gray-500">Matriculation</div>
                            <div>Pending Matriculation 001</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-16">
                        <div class="hidden lg:block">
                            <div class="text-xs text-gray-500">created by</div>
                            <div class="navigation-link">Prof. Dr. Mock</div>
                        </div>
                        <div class="flex space-x-2">
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-green-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-red-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="hidden md:hidden lg:block sm:block text-gray-500">6 days ago</div>
                    </div>
                </div>
                <hr class="dark:border-normalgray-700" />
                <div class="flex justify-between items-center p-4">
                    <div class="flex items-center space-x-4">
                        <span class="w-2 h-2 rounded-full bg-blue-700" />
                        <div class="">
                            <div class="text-xs text-gray-500">Matriculation</div>
                            <div>Pending Matriculation 001</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-16">
                        <div class="hidden lg:block">
                            <div class="text-xs text-gray-500">created by</div>
                            <div class="navigation-link">Prof. Dr. Mock</div>
                        </div>
                        <div class="flex space-x-2">
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-green-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-red-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="hidden md:hidden lg:block sm:block text-gray-500">6 days ago</div>
                    </div>
                </div>
                <hr class="dark:border-normalgray-700" />
                <div class="flex justify-between items-center p-4">
                    <div class="flex items-center space-x-4">
                        <span class="w-2 h-2 rounded-full bg-blue-700" />
                        <div class="">
                            <div class="text-xs text-gray-500">Matriculation</div>
                            <div>Pending Matriculation 001</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-16">
                        <div class="hidden lg:block">
                            <div class="text-xs text-gray-500">created by</div>
                            <div class="navigation-link">Prof. Dr. Mock</div>
                        </div>
                        <div class="flex space-x-2">
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-green-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-red-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div
                                class="flex items-center justify-center rounded-md w-8 h-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-blue-700 cursor-pointer"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="hidden md:hidden lg:block sm:block text-gray-500">6 days ago</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import SearchBar from "@/components/common/SearchBar.vue";
    import { ref } from "vue";

    export default {
        name: "Dashboard",
        components: {
            SearchBar,
        },
        setup() {
            const searchText = ref("");
            return {
                searchText,
            };
        },
    };
</script>
