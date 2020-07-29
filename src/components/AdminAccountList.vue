<template>
    <div class="w-full max-w-4xl">
        <div class="flex">
            <div class="w-full flex flex-row pt-2 mb-8">
                <seach-bar v-model:message="message" @refresh="refresh" />
                <router-link to="/createAccount" class="w-2/12 w- ml-4">
                    <button title="Add a new User" class="w-full p-2 btn-icon-green items-center justify-center flex flex-row">
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
    import SeachBar from "./SearchBar.vue";
    import { ref } from "vue";

    export default {
        name: "AdminAccountList",
        components: {
            AccountList,
            LoadingComponent,
            SeachBar,
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
