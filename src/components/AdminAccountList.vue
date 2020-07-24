<template>
    <div class="w-full max-w-4xl">
        <div class="flex">
            <div class="w-full flex flex-row pt-2 mb-8">
                <div class="w-full relative mx-auto text-gray-600 flex">
                    <i class="fas fa-search absolute left-0 top-0 mt-4 h-12 ml-4"></i>
                    <input
                        id="message"
                        v-model="message"
                        class="w-full border-2 border-gray-300 bg-white h-12 px-12 rounded-lg focus:outline-none"
                        type="search"
                        placeholder="Filter"
                    />
                    <button id="refresh" class="-ml-8 mr-5 focus:outline-none" title="Refresh" @click="refresh">
                        <i class="inline fas fa-redo-alt text-gray-600 hover:text-gray-700" />
                    </button>
                </div>
                <router-link to="/createAccount" class="w-2/12 w- ml-4">
                    <button title="Add a new User" class="w-full h-full btn-icon-green items-center justify-center flex flex-row">
                        <p class="mr-3 text-lg font-semibold">Add</p>
                        <i class="inline fas fa-user-plus text-lg" />
                    </button>
                </router-link>
            </div>
        </div>
        <suspense>
            <template #default>
                <accountList :key="refreshKey" />
            </template>
            <template #fallback>
                <loading-component />
            </template>
        </suspense>

        <div class="flex justify-center mt-16">
            <router-link to="/createAccount">
                <button id="addAccount" title="Add a new User" class="px-4 btn btn-green-primary-500">New Account</button>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import AccountList from "./AccountList.vue";
    import LoadingComponent from "./loading/Spinner.vue";
    import { ref } from "vue";

    export default {
        name: "AdminAccountList",
        components: {
            AccountList,
            LoadingComponent,
        },
        setup() {
            let message = ref("");
            let refreshKey = ref(false);

            function refresh() {
                refreshKey.value = !refreshKey.value;
            }
            return {
                refreshKey,
                refresh,
                message,
            };
        },
    };
</script>
