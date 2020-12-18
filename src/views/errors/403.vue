<template>
    <div class="flex w-full sm:mt-64 mt-32 items-center">
        <div class="md:flex md:flex-row flex-col justify-center w-full">
            <div class="sm:mr-12 lg:mr-24 text-6xl font-semibold text-center text-gray-900" style="font-size: 90px">403</div>

            <div class="flex flex-col justify-center">
                <div class="text-5xl font-semibold">Forbidden</div>
                <div class="mt-2 text-xl font-medium">Unfortunately, you are not allowed to access this page 😕</div>
                <div class="mt-1 text-sm text-gray-600">
                    You will be automatically redirected back in <span class="text-blue-700 font-medium">{{ countdown }}s</span>.
                </div>
                <button id="redirect" class="mt-6 flex items-center navigation-link-tmp" @click="redirect">
                    <span class="mr-2 text-sm font-bold">Take me back immediately</span>
                    <i class="fas text-sm fa-chevron-right" />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Router from "@/use/router/";
    import { ref } from "vue";
    import { onBeforeRouteLeave } from "vue-router";

    export default {
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
