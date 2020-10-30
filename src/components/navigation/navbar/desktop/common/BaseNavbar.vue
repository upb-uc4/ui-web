<template>
    <header class="flex items-center justify-between bg-gray-800 border-gray-800 md:h-20 min-h-20">
        <div class="flex items-center w-full">
            <div class="items-center h-20 px-5 rounded-lg cursor-pointer outline-none" title="Home" @click="routeLogo">
                <img src="../../../../../assets/logo/logo.svg" class="h-full py-3" />
            </div>

            <div class="flex w-full rounded-lg pl-8 lg:pr-8 pr-4">
                <nav class="items-center justify-between w-full md:flex">
                    <ul class="justify-between pt-2 font-semibold tracking-wider text-gray-200 md:flex">
                        <slot></slot>
                        <li>
                            <router-link id="routeCourseCatalog" :to="{ name: 'courseCatalog' }" class="navbar-menu">Course Catalog</router-link>
                        </li>
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
