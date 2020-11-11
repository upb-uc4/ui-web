<template>
    <div class="flex w-full sm:mt-64 mt-32 items-center">
        <div class="md:flex md:flex-row flex-col justify-center w-full">
            <div class="sm:mr-12 lg:mr-24 text-6xl font-semibold text-center text-blue-700" style="font-size: 96px">403</div>

            <div class="flex flex-col justify-center">
                <div class="text-5xl font-bold text-blue-700">Forbidden</div>
                <div class="text-xl font-medium">
                    <div>Unfortunately, you are not allowed to access this page :(</div>

                    <div>
                        You will be automatically redirected back in
                        <span class="text-2xl text-blue-700 font-bold">{{ countdown }}s</span>.
                    </div>
                </div>
                <div class="mt-10 text-xl font-medium">
                    <button id="redirect" class="w-full sm:w-auto p-3 btn btn-blue-secondary" @click="redirect">
                        Take me there immediately
                    </button>
                </div>
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
