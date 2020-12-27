<template>
    <header class="flex items-center justify-between bg-grayalt bg-normalgray-900 md:h-16 min-h-16">
        <div class="flex items-center w-full">
            <div class="items-center h-16 pl-8 rounded-lg cursor-pointer outline-none" title="Home" @click="routeLogo">
                <img src="../../../../../assets/logo/logo.svg" alt="uc4-logo" class="h-full py-3" />
            </div>

            <div class="flex w-full rounded-lg pl-8 lg:pr-8 pr-4">
                <nav class="items-center justify-between w-full md:flex">
                    <ul class="justify-between pt-2 font-bold text-sm text-gray-200 md:flex">
                        <slot></slot>
                        <li>
                            <router-link id="routeAbout" :to="{ name: 'about' }" class="navbar-menu">About</router-link>
                        </li>
                    </ul>

                    <div class="pb-3">
                        <slot name="right"></slot>
                    </div>
                </nav>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
    import { useStore } from "@/use/store/store";
    import Router from "@/use/router";

    export default {
        name: "BaseNavbar",
        setup() {
            function routeLogo() {
                let store = useStore();
                let loggedIn = store.getters.loggedIn;
                let logoTargetRoute = loggedIn ? "welcome" : "login";
                Router.push(logoTargetRoute);
            }
            return { routeLogo };
        },
    };
</script>
