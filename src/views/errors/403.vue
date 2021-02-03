<template>
    <base-view extra-classes="flex sm:mt-64 mt-32 items-center">
        <div class="md:flex md:flex-row flex-col justify-center w-full">
            <div class="sm:mr-12 lg:mr-24 text-6xl font-semibold text-center text-gray-900 dark:text-blue-700" style="font-size: 90px">
                403
            </div>

            <div class="flex flex-col justify-center">
                <div class="text-5xl font-semibold dark:text-gray-300">Forbidden</div>
                <div class="mt-2 text-xl font-medium dark:text-gray-300">Unfortunately, you are not allowed to access this page 😕</div>
                <div class="mt-1 text-sm text-gray-600 dark:text-gray-500">
                    You will be automatically redirected back in
                    <span class="text-blue-700 dark:text-blue-600 font-medium">{{ countdown }}s</span>.
                </div>
                <button id="redirect" class="mt-6 flex items-center navigation-link" @click="redirect">
                    <span class="mr-2 text-sm font-bold">Take me back immediately</span>
                    <i class="fas text-sm fa-chevron-right" />
                </button>
            </div>
        </div>
    </base-view>
</template>

<script lang="ts">
    import Router from "@/use/router/";
    import { ref } from "vue";
    import { onBeforeRouteLeave } from "vue-router";
    import BaseView from "@/views/common/BaseView.vue";

    export default {
        components: {
            BaseView,
        },
        setup() {
            let countdown = ref(10);
            let timeout = ref({} as NodeJS.Timeout);

            //setup the timer
            countDownTimer();

            onBeforeRouteLeave(async (to, from, next) => {
                clearInterval(timeout.value);
                return next();
            });

            function countDownTimer() {
                timeout.value = setInterval(() => {
                    if (countdown.value > 0) {
                        countdown.value = countdown.value - 1;
                    } else {
                        redirect();
                    }
                }, 1000);
            }

            function redirect() {
                Router.go(-1);
            }

            return {
                countdown,
                timeout,
                redirect,
            };
        },
    };
</script>
